import { Request, Response } from 'express';
import { ValidationError } from 'yup';

import { prisma } from '../database';
import { CreatePostSchema } from '../utils/Validators';

interface CreatePostInput {
  content?: string;
  validator?: string;
}

export default {
  async createPost(request: Request, response: Response) {
    const { content, validator } = request.body as CreatePostInput;

    if (!validator) return response.status(400).json({ error: 'Validator is required' });

    if (validator !== process.env.VALIDATOR)
      return response.status(401).json({ error: 'Invalid validator' });

    try {
      CreatePostSchema.validateSync({ content });
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.status(400).json({ error: 'Bad request' });
      }

      console.log(error);

      return response.status(500).json({ error: 'Internal server error' });
    }

    const data = CreatePostSchema.cast({ content }) as any;

    const post = await prisma.post.create({
      data,
    });

    return response.status(201).json(post);
  },

  async getPosts(request: Request, response: Response) {
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
  },
};