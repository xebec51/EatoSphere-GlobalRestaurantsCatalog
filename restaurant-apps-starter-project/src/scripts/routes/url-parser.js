const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    if (!this._isValidUrl(url)) {
      throw new Error('Invalid URL');
    }
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    if (!this._isValidUrl(url)) {
      throw new Error('Invalid URL');
    }
    return this._urlSplitter(url);
  },

  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    if (!urlsSplits[1]) return { resource: null, id: null, verb: null };
    return {
      resource: urlsSplits[1] || null,
      id: urlsSplits[2] || null,
      verb: urlsSplits[3] || null,
    };
  },

  _urlCombiner(splitedUrl) {
    return (splitedUrl.resource ? `/${splitedUrl.resource}` : '/') +
      (splitedUrl.id ? '/:id' : '') +
      (splitedUrl.verb ? `/${splitedUrl.verb}` : '');
  },

  _isValidUrl(url) {
    const urlPattern = /^\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)*(\/[a-zA-Z0-9-]+)?$/;
    return urlPattern.test(url);
  },
};

export default UrlParser;