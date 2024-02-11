import { z } from '@hono/zod-openapi';

export const schemaCreateNoteResponse = z.object({
	note_id: z.string().openapi({
		example: 'node_id'
	})
});
