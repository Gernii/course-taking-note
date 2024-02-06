import type { createRoute } from '@hono/zod-openapi';

import { Error400To499Schema } from '$schemas/error.schema';

export const createPrivateRoute = (route: ReturnType<typeof createRoute>) => {
	route.security = [
		{
			Bearer: [] // <- Add security name (must be same)
		},
		...(route.security ? route.security : [])
	];

	route.responses = {
		400: {
			content: {
				'application/json': {
					schema: Error400To499Schema
				}
			},
			description: 'Returns an error'
		},
		...route.responses
	};

	return route;
};
