class IconSet extends HTMLElement {
  connectedCallback() {
    const imageUrl = this.getAttribute("imageUrl");
    if (!imageUrl) return;
    fetch(imageUrl)
      .then((response) => response.text())
      .then((svgContent) => {
        const temp = document.createElement("div");
        temp.innerHTML = svgContent;
        const svg = temp.querySelector("svg");
        if (!svg) return;
        svg.setAttribute("aria-hidden", "true");
        this.classList.forEach((cls) => svg.classList.add(cls));
        if (this.parentNode) this.parentNode.replaceChild(svg, this);
      })
      .catch(() => {});
  }
}

if (!customElements.get("icon-set")) {
  customElements.define("icon-set", IconSet);
}
