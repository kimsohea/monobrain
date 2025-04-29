const importMetaUrl = import.meta.url;

class RemoteHTMLEmbed extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  handleScriptsLoaded() {
    // Custom logic to execute after all scripts are loaded
    initCommonScrit();
  }

  connectedCallback() {
    (async () => {
      const htmlUrl = this.getAttribute("html-url");
      const dom = await (async () => {
        if (htmlUrl) {
          const res = await fetch(htmlUrl);
          const html = await res.text();
          const parser = new DOMParser();
          return parser.parseFromString(html, "text/html");
        } else return document;
      })();
      const content = dom.querySelector("template").content;
      const wrap = content.querySelector("div");
      this.shadowRoot?.appendChild(wrap);
      if (htmlUrl) {
        const imgs = wrap.querySelectorAll("img");
        imgs.forEach((img) => {
          const href = new URL(img.getAttribute("src") ?? "", htmlUrl).href;
          img.setAttribute("src", href);
        });
        const videos = wrap.querySelectorAll("video");
        videos.forEach((video) => {
          const href = new URL(video.getAttribute("src") ?? "", htmlUrl).href;
          video.setAttribute("src", href);
        });
        const audios = wrap.querySelectorAll("audio");
        audios.forEach((audio) => {
          const href = new URL(audio.getAttribute("src") ?? "", htmlUrl).href;
          audio.setAttribute("src", href);
        });

        // 새로 추가되는 이미지, 오디오, 비디오 요소 src 속성 수정
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((n, idx) => {
              if (n instanceof HTMLAudioElement || n instanceof HTMLVideoElement || n instanceof HTMLImageElement) {
                const href = new URL(n.getAttribute("src") ?? "", htmlUrl).href;
                n.setAttribute("src", href);
              }
            });
          });
        });
        observer.observe(wrap, {
          childList: true,
          subtree: true,
        });
      }

      const links = content.querySelectorAll("link");
      links.forEach((link) => {
        if (htmlUrl) {
          const href = new URL(link.getAttribute("href") ?? "", htmlUrl).href;
          link.setAttribute("href", href);
        }
        this.shadowRoot?.appendChild(link);
      });

      const scripts = content.querySelectorAll("script");
      const scriptLen = scripts.length;
      for (let i = 0; i < scriptLen; i++) {
        let scriptSrc = scripts[i].getAttribute("src");
        if (scriptSrc && htmlUrl) scriptSrc = new URL(scriptSrc, htmlUrl).href;
        await this.loadScript(scriptSrc);
      }
      this.handleScriptsLoaded();
    })();
  }

  loadScript(scriptSrc) {
    return new Promise((resovle, reject) => {
      const scriptEl = document.createElement("script");
      scriptEl.setAttribute("src", scriptSrc);
      this.shadowRoot?.appendChild(scriptEl);

      scriptEl.addEventListener("load", resovle);
      scriptEl.addEventListener("error", reject);
    });
  }
}

customElements.define("remote-html-embed", RemoteHTMLEmbed);
