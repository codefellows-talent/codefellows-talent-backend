import database from './database.js';
import express from 'express';

const app = express();
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