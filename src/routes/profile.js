import { Router } from 'express';
import superagent from 'superagent';
import parseCSV from '../lib/parse-csv.js';

const profileRouter = new Router();

const uri = `${process.env.API_URI}/profiles`;

profileRouter.get(uri, (req, res) => {
  console.log('Serving some static profiles for dev porpoises!');
  // temporarily use static sample.csv as data source
  superagent.get(process.env.S3_CSV_URI)
    .then(res => res.text)
    .then(data => parseCSV(data))
    .then(parsedData => {
      // TODO:
      //   * assign profiles an id, send that too for client to use
      //     * can salesforceId uniquely id all profiles? preferably use that
      //       * YES per Jeff Malek
      //   * cache profiles in memory
      //     * serve first page from memcache, while csv get/parse is ongoing
      //     * use cache on POST /api/v1/connect to retrieve email associated with a profile
      //     * use Redis or another memcache tool? (would be cool to learn!)
      //   * strip out email and salesforceId before sending profiles
      // respond with [profiles]
      res.status(200)
        .json(parsedData);
    })
    .catch(err => {
      res.sendStatus(500);
      console.error(err);
    });
});

export default profileRouter;
