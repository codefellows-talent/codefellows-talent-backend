// import database from './database.js';
// import express from 'express';
// import routes from '../routes';
// import cors from 'cors';
// import morgan from 'morgan';
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('../routes');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(routes);

app.all('/api/*', (req, res, next) => {
  res.sendStatus(404);
});

app.use(require('./error-middleware.js'));

const server = module.exports = {};

server.isOn = false;
server.start = () => {
  return new Promise((resolve, reject) => {
    if (!server.isOn) {
      server.http = app.listen(process.env.PORT, () => {
        server.isOn = true;
        console.log('Server is up at PORT:', process.env.PORT);
        resolve();
      });
      return;
    }
    reject(new Error('Sever is already UP'));
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if (server.http && server.isOn) {
      return server.http.close(() => {
        server.isOn = false;
        console.log('Server is Down');
        resolve();
      });
    }
    reject(new Error('Server is not running'));
  });
};

//
// const appState = {
//   isOn: false,
//   http: null,
// };
//
// const start = () => {
//   return new Promise((resolve, reject) => {
//     if(appState.isOn) {
//       return reject(new Error('Server is already on.'));
//     }
//     database.start()
//       .then(() => {
//         appState.http = app.listen(process.env.PORT, () => {
//           console.log(`Server up at port ${process.env.PORT}`);
//           appState.isOn = true;
//           resolve();
//         });
//       });
//   });
// };
//
// const stop = () => {
//   return new Promise((resolve, reject) => {
//     if(!appState.isOn) {
//       return reject(new Error('Server is not running.'));
//     }
//     database.stop()
//       .then(() => {
//         appState.http.close(() => {
//           console.log('Server stopped.');
//           appState.isOn = false;
//           appState.http = null;
//           resolve();
//         });
//       })
//       .catch(err => reject(err));
//   });
// };
//
// export default { start, stop };
