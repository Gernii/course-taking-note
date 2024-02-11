import { OpenAPIHono } from '@hono/zod-openapi';

import { controllerNoteCreate } from './create';

export const controllerNotes = new OpenAPIHono();

controllerNotes.route('/', controllerNoteCreate);
