import { z } from '@hono/zod-openapi';

export const signUpBodySchema = z.object({
	username: z.string().openapi({
		example: 'litahung'
	}),
	password: z.string().max(18).openapi({
		example: 'password1234'
	})
});

export const signUpResponseSchema = z.object({
	access_token: z.string().openapi({
		example: 'JWT token'
	}),
	refresh_token: z.string().openapi({
		example: 'JWT token'
	})
});
