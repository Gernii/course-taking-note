import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { StatusCodes } from 'http-status-codes';

import type { Env } from '$configs/type.config';

import { routeNoteCreate } from '$routes/notes/create';

import { customHTTPException } from '$utils/create-custom-error-message';

import { noteCreate } from '$services/notes/create';

export const controllerNoteCreate = new OpenAPIHono<Env>();

controllerNoteCreate.openapi(routeNoteCreate, async (c) => {
	const user = c.var.user;

	if (!user) {
		throw customHTTPException(StatusCodes.UNAUTHORIZED, {
			message: 'Unauthorized'
		});
	}

	const envDt = env(c);

	const newNode = await noteCreate(envDt, { userId: user.id });

	if (!newNode) {
		throw customHTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'Failed to create note'
		});
	}

	return c.json({ note_id: newNode.id });
});
