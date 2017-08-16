import { Router } from 'express';

import profileRoutes from './profile.js';
import connectRoutes from './connect.js';


export default new Router()
  .use([
    profileRoutes,
    connectRoutes,
  ]);
