import { OpenAPIHono } from '@hono/zod-openapi';

import { controllerUploadsImage } from './image';

export const controllerUploads = new OpenAPIHono();

controllerUploads.route('/', controllerUploadsImage);
