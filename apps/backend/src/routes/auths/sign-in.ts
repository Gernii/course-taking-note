import { StatusCodes } from 'http-status-codes';

import { createCommonRoute } from '$utils/create-custom-route';

import { schemaSignInBody, schemaSignInResponse } from '$schemas/auths/sign-in';

export const routeAuthSignIn = createCommonRoute({
	method: 'post',
	path: 'signin',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemaSignInBody
				}
			},
			description: 'Retrieve the user'
		}
	},
	responses: {
		[StatusCodes.OK]: {
			content: {
				'application/json': {
					schema: schemaSignInResponse
				}
			},
			description: 'Retrieve the user'
		}
	},
	tags: ['Auths']
});
