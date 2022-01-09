import { Router } from 'express';

import { prisma } from './database';

const routes = Router();

routes.get('/posts', async (request, response) => {
  const { page } = request.query;

  const parsedPage = parseInt(page as string) || 1;
  const postLength = await prisma.post.count();
  const posts = await prisma.post.findMany({
    skip: parsedPage * 10 - 10,
    take: 10,
  });

  return response.json({
    total: postLength,
    limit: 10,
    page: parsedPage,
    pages: Math.floor(postLength / 10) + 1,
    data: posts,
  });
});

routes.post('/posts', (request, response) => {
  return response.json(null);
});

export { routes };
