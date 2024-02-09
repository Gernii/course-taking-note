import { z } from '@hono/zod-openapi';

export const schemaUploadsImageResponse = z.object({
	image_url: z.string().openapi({
		example: 'https://example.com/image.jpg'
	})
});
