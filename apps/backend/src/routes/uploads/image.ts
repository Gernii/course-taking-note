import { createPrivateRoute } from '$utils/create-custom-route';

import { schemaUploadsImageResponse } from '$schemas/uploads/image';

export const routeUploadImage = createPrivateRoute({
	method: 'post',
	path: 'image',
	request: {
		body: {
			content: {
				'multipart/form-data': {
					schema: {
						type: 'object',
						properties: {
							image: {
								type: 'string',
								format: 'binary'
							}
						}
					}
				}
			},
			description: 'Upload image with formdata'
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemaUploadsImageResponse
				}
			},
			description: 'Response about image uploaded url'
		}
	},
	tags: ['Uploads']
});
