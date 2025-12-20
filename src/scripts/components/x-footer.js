class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <p>&copy; 2025 Story Buddy — Built with ❤️ by Arimbi using Dicoding API</p>
      </footer>
    `;
  }
}

customElements.define("x-footer", Footer);
