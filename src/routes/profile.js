import { Router } from 'express';
import superagent from 'superagent';
import parseCSV from '../lib/parse-csv.js';
import appCache from '../model/cache.js';

const profileRouter = new Router();

const uri = `${process.env.API_URI}/profiles`;

profileRouter.get(uri, (req, res) => {
  console.log('Serving some static profiles for dev porpoises!');
  // temporarily use static sample.csv as data source
  appCache.update()
    .then(() => appCache.getPage())
    .then(profiles => {
      const sanitizedProfiles = profiles.map(profile => {
        const sanitized = {...profile};
        delete sanitized.email;
        return sanitized;
      });
      res.status(200)
        .json(sanitizedProfiles);
    })
    .catch(err => {
      res.sendStatus(500);
      console.error(err);
    });
});

export default profileRouter;
