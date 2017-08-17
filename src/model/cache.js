import superagent from 'superagent';
import 'seedrandom';
import uuid from 'uuid/v4';

import parseCSV from '../lib/parse-csv.js';

const CACHE_UPDATE_INTERVAL = process.env.CACHE_UPDATE_INTERVAL || 60000;

class Cache {
  constructor() {
    this.profiles = new Map();
    this.lastUpdated = -1;
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

  getPage(num = 10, page = 1) {
    return this.update()
      .then(() => [...this.profiles.values()].slice((page - 1) * num, page * num));
  }

  update() {
    if(Date.now() - this.lastUpdated < CACHE_UPDATE_INTERVAL) {
      console.log('Now is not the time to update the cache!');
      return Promise.resolve();
    }
    console.log('Updating the cache.');
    this.lastUpdated = Date.now();
    return superagent.get(process.env.S3_CSV_URI)
      .then(res => res.text)
      .then(data => parseCSV(data))
      .then(parsedData => {
        parsedData.forEach(profile => this.add(profile));
      });
  }

  getShuffleToken() {
    return uuid();
  }

  getShufflePage(shuffleToken, num = 10, page = 0) {
    return this.update()
      .then(() => this._getShufflePage(shuffleToken, num, page));
  }

  _getShufflePage(shuffleToken, num = 10, page = 0) {
    num = Number(num);
    page = Number(page);
    const returnPage = [];
    const rng = new Math.seedrandom(shuffleToken);

    function* shuffleAndRemove (rng, array) {
      let _arr = array;

      const rearrange = (array, randomValue) => {
        if(array.length <= 0)
          return null;
        if(array.length === 1)
          return array;
        const idx = Math.floor(randomValue * array.length);
        return array.slice(idx).concat(array.slice(0, idx));
      };

      while(_arr.length > 0) {
        _arr = rearrange(_arr, rng());
        yield _arr[0];
        _arr = _arr.slice(1);
      }
    }

    const start = (page - 1) * num - 1;
    const shuffler = shuffleAndRemove(rng, Array.from(this.profiles.values()));
    for(let i = 0; i < start; i++) {
      shuffler.next();
    }
    for(let i = start; i < start + num; i++) {
      const res = shuffler.next();
      if(!res.done) {
        returnPage.push(res.value);
      }
    }
    return returnPage;
  }
}

const appCache = new Cache();

export default appCache;
