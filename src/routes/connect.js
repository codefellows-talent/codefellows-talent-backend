import { Router } from 'express';
import { json } from 'body-parser';

import appCache from '../model/cache.js';
import { sendConnectionEmail, sendClientEmail } from '../lib/email.js';

const uri = `${process.env.API_URI}/connect`;

const connectRouter = new Router();

connectRouter.post(uri, json(), (req, res) => {
  if(!(req.body.email && req.body.company && req.body.name)) {
    return res.status(400)
      .send('Incomplete submission. Body must include name, company, and email fields.');
  }
  Promise.all(req.body.ids.map(id => appCache.get(id)))
    .then(profiles => sendConnectionEmail(profiles, req.body))
    .then(() => sendClientEmail(req.body))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

export default connectRouter;
