import { z } from '@hono/zod-openapi';

export const schemaRefreshTokenBody = z.object({
	refresh_token: z.string().openapi({
		example: 'JWT Refresh Token'
	})
});

export const schemaRefreshTokenResponse = z.object({
	access_token: z.string().openapi({
		example: 'JWT Token'
	})
});

export const schemaRefreshToken401Response = z.object({
	message: z.string().openapi({
		example: 'Unauthorized'
	})
});
