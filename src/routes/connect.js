import { Router } from 'express';
import { json } from 'body-parser';

import appCache from '../model/cache.js';
import { sendConnectionEmail as _sendConnectionEmail, sendClientEmail as _sendClientEmail } from '../lib/email.js';

const uri = `${process.env.API_URI}/connect`;

const connectRouter = new Router();

const rateLimit = (fn, frequency) => {
  let queue = [];
  let interval = null;
  return (...args) => {
    const callFn = () => fn(...args);
    if(!interval) {
      interval = setInterval(() => {
        if(queue.length > 0) {
          queue.shift()();
        } else {
          clearInterval(interval);
          interval = null;
        }
      }, frequency);
      callFn();
    }
    queue.push(callFn);
  };
};

const sendConnectionEmail = rateLimit(_sendConnectionEmail, 5000);
const sendClientEmail = rateLimit(_sendClientEmail, 5000);

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
