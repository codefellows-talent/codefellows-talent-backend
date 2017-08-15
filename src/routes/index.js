// import profileRoutes from './profile.js';
//
// export default profileRoutes;
const {Router} = require('express');
const profileData = require('../csv/convertedData.json');

const profileRouter = module.exports = new Router();

profileRouter.get('/api/profiles', (req, res, next) => {
  return res.json(profileData);
});
