import { z } from '@hono/zod-openapi';

export const schemaSignInBody = z.object({
	username: z.string().openapi({
		example: 'username'
	}),
	password: z.string().openapi({
		example: 'password'
	})
});

export const schemaSignInResponse = z.object({
	access_token: z.string().openapi({
		example: 'JWT Token'
	}),
	refresh_token: z.string().openapi({
		example: 'JWT Token'
	})
});
