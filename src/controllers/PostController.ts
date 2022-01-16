import { Request, Response } from 'express';
import { ValidationError } from 'yup';

import { prisma } from '../database';
import { CreatePostSchema } from '../utils/Validators';

interface CreatePostInput {
  note?: string;
  content?: string;
  validator?: string;
}

export default {
  async createPost(request: Request, response: Response) {
    const { content, validator, note } = request.body as CreatePostInput;

    if (!validator) return response.status(400).json({ error: 'Validator is required' });

    if (validator !== process.env.VALIDATOR)
      return response.status(401).json({ error: 'Invalid validator' });

    try {
      CreatePostSchema.validateSync({ content, note });
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.status(400).json({ error: 'Bad request' });
      }

      console.log(error);

      return response.status(500).json({ error: 'Internal server error' });
    }

    const data = CreatePostSchema.cast({ content, note }) as any;

    const post = await prisma.post.create({
      data,
    });

    return response.status(201).json(post);
  },

  async getPosts(request: Request, response: Response) {
    const query = new URLSearchParams(request.url.split('?')[1]);

    const page = parseInt(query.get('page') || '1');
    const search = query.get('search') || '';

    const where = {
      OR: [
        {
          content: {
            contains: search,
          },
        },
        {
          note: {
            contains: search,
          },
        },
      ],
    };

    const parsedPage = Math.max(page, 1);
    const postLength = await prisma.post.count({ where });
    const posts = await prisma.post.findMany({
      skip: parsedPage * 10 - 10,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      where,
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
