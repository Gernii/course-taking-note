import { StatusCodes } from 'http-status-codes';

import { createPrivateRoute } from '$utils/create-custom-route';

import {
	schemaRefreshPasswordBody,
	schemaRefreshPasswordResponse
} from '$schemas/auths/refresh-password';

export const routeAuthRefreshPassword = createPrivateRoute({
	method: 'post',
	path: 'refresh-password',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemaRefreshPasswordBody
				}
			},
			description: 'Retrieve passwords'
		}
	},
	responses: {
		[StatusCodes.OK]: {
			content: {
				'application/json': {
					schema: schemaRefreshPasswordResponse
				}
			},
			description: 'Refresh password success'
		}
	},
	tags: ['Auths']
});
