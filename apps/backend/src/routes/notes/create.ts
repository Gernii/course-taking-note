import { StatusCodes } from 'http-status-codes';

import { createPrivateRoute } from '$utils/create-custom-route';

import { schemaCreateNoteResponse } from '$schemas/notes/create';

export const routeNoteCreate = createPrivateRoute({
	method: 'get',
	path: '/create',
	responses: {
		[StatusCodes.OK]: {
			content: {
				'application/json': {
					schema: schemaCreateNoteResponse
				}
			},
			description: 'Return note_id'
		}
	},
	tags: ['Notes']
});
