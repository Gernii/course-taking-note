import type { createRoute } from '@hono/zod-openapi';
import { StatusCodes } from 'http-status-codes';

import { schemaError400To499 } from '$schemas/error';

export const createPrivateRoute = <T extends ReturnType<typeof createRoute>>(route: T) => {
	route.security = [
		{
			Bearer: [] // <- Add security name (must be same)
		},
		...(route.security ? route.security : [])
	];

	route.responses = {
		[StatusCodes.BAD_REQUEST]: {
			content: {
				'application/json': {
					schema: schemaError400To499
				}
			},
			description: 'Returns an error'
		},
		...route.responses
	};

	return route;
};

export const createCommonRoute = <T extends ReturnType<typeof createRoute>>(route: T) => {
	route.responses = {
		[StatusCodes.BAD_REQUEST]: {
			content: {
				'application/json': {
					schema: schemaError400To499
				}
			},
			description: 'Returns an error'
		},
		...route.responses
	};

	return route;
};
