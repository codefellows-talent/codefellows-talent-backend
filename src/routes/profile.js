import { Router } from 'express';
import appCache from '../model/cache.js';

const profileRouter = new Router();

const uri = `${process.env.API_URI}/profiles`;

const sanitize = profiles => profiles.map(profile => {
  const sanitized = {...profile};
  delete sanitized.email;
  return sanitized;
});

profileRouter.get(uri, (req, res) => {
  console.log('Serving some static profiles for dev porpoises!');
  // temporarily use static sample.csv as data source
  const page = req.query.page || 1;
  const pageLength = req.query.length || 10;
  let shuffleToken = req.query.shuffleToken;
  if(req.query.shuffle) {
    console.log('shuffle token is: ')
    shuffleToken = appCache.getShuffleToken();
    console.log(shuffleToken);
  }
  if(shuffleToken) {
    console.log('using shuffle!')
    console.log(`token ${shuffleToken}, length ${pageLength}, page ${page}`)
    return appCache.getShufflePage(shuffleToken, pageLength, page)
      .then(profiles => {
        const sanitizedProfiles = sanitize(profiles);
        const returnVal = {
          profiles: sanitizedProfiles,
          shuffleToken,
        };
        res.status(200)
          .json(returnVal);
      });
  }
  appCache.getPage(pageLength, page)
    .then(profiles => {
      const sanitizedProfiles = sanitize(profiles);
      res.status(200)
        .json(sanitizedProfiles);
    })
    .catch(err => {
      res.sendStatus(500);
      console.error(err);
    });
});

export default profileRouter;
