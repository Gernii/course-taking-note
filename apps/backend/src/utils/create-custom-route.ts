import { createRoute } from '@hono/zod-openapi';
import { StatusCodes } from 'http-status-codes';

import { schemaError400To499 } from '$schemas/error';

export const createPrivateRoute = <T extends Parameters<typeof createRoute>[0]>(route: T) => {
	const bewRoute = createRoute({
		...route,
		security: [{ Bearer: [] }, ...(route.security ? route.security : [])],
		responses: {
			[StatusCodes.BAD_REQUEST]: {
				content: { 'application/json': { schema: schemaError400To499 } },
				description: 'Returns an error'
			},
			...route.responses
		}
	});
	return bewRoute;
};

export const createCommonRoute = <T extends Parameters<typeof createRoute>[0]>(route: T) => {
	const bewRoute = createRoute({
		...route,
		responses: {
			[StatusCodes.BAD_REQUEST]: {
				content: {
					'application/json': {
						schema: schemaError400To499
					}
				},
				description: 'Returns an error'
			},
			...route.responses
		}
	});
	return bewRoute;
};
