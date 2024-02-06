import { z } from '@hono/zod-openapi';

export const Error400To499Schema = z
	.object({
		code: z.number().openapi({
			example: 401
		}),
		message: z.string().openapi({
			example: 'Unauthorized'
		})
	})
	.openapi('400-499');
