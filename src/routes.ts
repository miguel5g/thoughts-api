import { Router } from 'express';

const routes = Router();

routes.get('/posts', (request, response) => {
  return response.json(null);
});

routes.post('/posts', (request, response) => {
  return response.json(null);
});

export { routes };
