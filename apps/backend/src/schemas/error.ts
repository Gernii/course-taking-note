import { z } from '@hono/zod-openapi';

export const schemaError400To499 = z
	.object({
		message: z.string().openapi({
			example: 'Unauthorized'
		})
	})
	.openapi('400-499');
