import database from './database.js';
import express from 'express';
import routes from '../routes';
import morgan from 'morgan';
import cors from 'cors';

import appCache from '../model/cache.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(routes);

const appState = {
  isOn: false,
  http: null,
};

const start = () => {
  return new Promise((resolve, reject) => {
    if(appState.isOn) {
      return reject(new Error('Server is already on.'));
    }
    database.start()
      .then(() => {
        appState.http = app.listen(process.env.PORT, () => {
          console.log(`Server up at port ${process.env.PORT}`);
          appCache.update()
            .then(() => console.log(`App cache populated.`));
          appState.isOn = true;
          resolve();
        });
      });
  });
};

const stop = () => {
  return new Promise((resolve, reject) => {
    if(!appState.isOn) {
      return reject(new Error('Server is not running.'));
    }
    database.stop()
      .then(() => {
        appState.http.close(() => {
          console.log('Server stopped.');
          appState.isOn = false;
          appState.http = null;
          resolve();
        });
      })
      .catch(err => reject(err));
  });
};

export default { start, stop };
