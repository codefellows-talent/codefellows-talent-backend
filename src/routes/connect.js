import { Router } from 'express';
import { json } from 'body-parser';

import appCache from '../model/cache.js';
import { sendConnectionEmail, sendClientEmail } from '../lib/email.js';

const uri = `${process.env.API_URI}/connect`;

const connectRouter = new Router();

connectRouter.post(uri, json(), (req, res) => {
  if(!req.body.email) {
    res.status(400)
      .send('No client email field was included. A client email is required to connect with graduates.');
  }
  Promise.all(req.body.ids.map(id => appCache.get(id)))
    .then(profiles => sendConnectionEmail(profiles))
    .then(() => sendClientEmail(req.body.email))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.sendStatus(501);
    });
});

export default connectRouter;
