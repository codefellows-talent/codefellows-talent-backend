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
}

const appCache = new Cache();

export default appCache;
