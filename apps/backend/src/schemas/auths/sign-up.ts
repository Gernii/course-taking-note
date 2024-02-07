import { z } from '@hono/zod-openapi';

export const schemaSignUpBody = z.object({
	username: z.string().openapi({
		example: 'litahung'
	}),
	password: z
		.string()
		.min(8, 'Invalid')
		.regex(/(?![a-zA-Z\d\W])/g, 'Invalid')
		.openapi({
			example: 'password1234'
		})
});

export const schemaSignUpResponse = z.object({
	access_token: z.string().openapi({
		example: 'JWT token'
	}),
	refresh_token: z.string().openapi({
		example: 'JWT token'
	})
});
