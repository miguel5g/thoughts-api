import { Router } from 'express';

import ThoughtsController from './controllers/ThoughtsController';

const routes = Router();

routes.get('/thoughts', ThoughtsController.getPosts);
routes.post('/thoughts', ThoughtsController.createPost);

export { routes };
