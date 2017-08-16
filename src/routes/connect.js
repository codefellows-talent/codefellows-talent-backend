import { Router } from 'express';
import { json } from 'body-parser';

import appCache from '../model/cache.js';
import sendEmail from '../lib/email.js';

const uri = `${process.env.API_URI}/connect`;

const connectRouter = new Router();

connectRouter.post(uri, json(), (req, res) => {
  console.log('hit post route');
  Promise.all(req.body.ids.map(id => appCache.get(id)))
    .then(profiles => sendEmail(profiles))
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(501));
});

export default connectRouter;
