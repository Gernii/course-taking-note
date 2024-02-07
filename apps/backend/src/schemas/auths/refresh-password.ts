import { z } from '@hono/zod-openapi';

export const schemaRefreshPasswordBody = z.object({
	username: z.string().optional().openapi({
		example: 'username'
	}),
	password: z
		.string()
		.min(8, 'Invalid')
		.regex(/(?![a-zA-Z\d\W])/g, 'Invalid')
		.openapi({
			example: 'password'
		}),
	new_password: z
		.string()
		.min(8, 'Invalid')
		.regex(/(?![a-zA-Z\d\W])/g, 'Invalid')
		.openapi({
			example: 'new_password'
		})
});

export const schemaRefreshPasswordResponse = z.object({
	message: z.string().openapi({
		example: 'Password updated'
	})
});
