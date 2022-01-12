import { Router } from 'express';

import PostController from './controllers/PostController';

const routes = Router();

routes.get('/posts', PostController.getPosts);
routes.post('/posts', PostController.createPost);

export { routes };
