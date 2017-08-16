
import mongoose from 'mongoose';
mongoose.Promise = Promise;

// database state
//const dbState = { isOn: false };

const start = () => {
  console.log('Database would have been started.');
  return Promise.resolve(true);
  //console.log('Starting database.');
  // if(dbState.isOn) {
  //   return Promise.reject(new Error('Database is already running.'));
  // }
  // return mongoose.connect(`${process.env.MONGODB_URI}/cf-hired`, { useMongoClient: true })
  //   .then(it => {
  //     console.log(`Database up at ${process.env.MONGODB_URI}`);
  //     dbState.isOn = true;
  //     return it;
  //   });
};

const stop = () => {
  console.log('Database would have been stopped.');
  return Promise.resolve(true);
  // if(!dbState.isOn) {
  //   return Promise.reject(new Error('Database is not running.'));
  // }
  // return mongoose.disconnect()
  //   .then(it => {
  //     console.log('Database stopped.');
  //     dbState.isOn = false;
  //     return it;
  //   });
};

export default { start, stop };
