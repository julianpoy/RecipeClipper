import sanitizeHtml from 'sanitize-html'

Object.defineProperty(global.Element.prototype, 'innerText', {
  get() {
    return sanitizeHtml(this.textContent, {
      allowedTags: [],
      allowedAttributes: {},
    }).split('\n').map(line => line.trim()).filter(line => line).join('\n');
  },
  configurable: true,
});

