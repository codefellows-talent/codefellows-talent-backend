import superagent from 'superagent';

import parseCSV from '../lib/parse-csv.js';

class Cache {
  constructor() {
    this.profiles = new Map();
  }

  add(profile) {
    if(!profile.salesforceId) {
      console.error('Tried to add a profile without a salesforceId to cache');
      return Promise.resolve(null);
    }
    this.profiles.set(profile.salesforceId, profile);
    return Promise.resolve(profile);
  }

  get(id) {
    return Promise.resolve(this.profiles.get(id));
  }

  getPage(num = 10, page = 0) {
    return Promise.resolve([...this.profiles.values()].slice(page * num, (page + 1) * num));
  }

  update() {
    return superagent.get(process.env.S3_CSV_URI)
      .then(res => res.text)
      .then(data => parseCSV(data))
      .then(parsedData => {
        parsedData.forEach(profile => this.add(profile));
      });
  }
}

const appCache = new Cache();

export default appCache;
