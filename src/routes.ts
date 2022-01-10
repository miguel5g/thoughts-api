import { Router } from 'express';

import { prisma } from './database';

interface CreatePostInput {
  content?: string;
  validator?: string;
  createdAt?: string;
}

const routes = Router();

routes.get('/posts', async (request, response) => {
  const { page } = request.query;

  const parsedPage = Math.max(parseInt(page as string) || 1, 1);
  const postLength = await prisma.post.count();
  const posts = await prisma.post.findMany({
    skip: parsedPage * 10 - 10,
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return response.json({
    total: postLength,
    limit: 10,
    page: parsedPage,
    pages: Math.floor(postLength / 10) + 1,
    data: posts,
  });
});

routes.post('/posts', async (request, response) => {
  const { content, validator, createdAt } = request.body as CreatePostInput;

  if (!content || !validator)
    return response.status(400).json({ error: 'Missing content or validator' });

  let createdAtDate: Date | undefined = undefined;

  if (createdAt) createdAtDate = new Date(createdAt);

  if (validator !== process.env.VALIDATOR)
    return response.status(401).json({ error: 'Invalid validator' });

  const post = await prisma.post.create({
    data: {
      content,
      createdAt: createdAtDate,
      updatedAt: createdAtDate,
    },
  });

  return response.status(201).json(post);
});

export { routes };
