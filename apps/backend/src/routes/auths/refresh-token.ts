import { StatusCodes } from 'http-status-codes';

import { createCommonRoute } from '$utils/create-custom-route';

import {
	schemaRefreshToken401Response,
	schemaRefreshTokenBody,
	schemaRefreshTokenResponse
} from '$schemas/auths/refresh-token';

export const routeAuthRefreshToken = createCommonRoute({
	method: 'post',
	path: 'refresh-token',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemaRefreshTokenBody
				}
			},
			description: 'Retrieve refresh token'
		}
	},
	responses: {
		[StatusCodes.OK]: {
			content: {
				'application/json': {
					schema: schemaRefreshTokenResponse
				}
			},
			description: 'Return new access token'
		},
		[StatusCodes.UNAUTHORIZED]: {
			content: {
				'application/json': {
					schema: schemaRefreshToken401Response
				}
			},
			description: 'Warning unauthorized'
		}
	},
	tags: ['Auths']
});
