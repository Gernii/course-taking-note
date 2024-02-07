import { createCommonRoute } from '$utils/create-custom-route';

import { schemaSignUpBody, schemaSignUpResponse } from '$schemas/auths/sign-up';

export const routeAuthSignUp = createCommonRoute({
	method: 'post',
	path: 'signup',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemaSignUpBody
				}
			},
			description: 'Sign up the user'
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemaSignUpResponse
				}
			},
			description: 'Response about sign up'
		}
	},
	tags: ['Auths']
});
