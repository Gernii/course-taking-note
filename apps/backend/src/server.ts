import './pre-init';

// import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { serve } from '@hono/node-server';
import { HTTPException } from 'hono/http-exception';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger } from 'hono/logger';

import type { Env } from '$configs/type.config';

import { deserializeUserMiddleware } from '$middlewares/deserialize-user';
import { setLanguageMiddleware } from '$middlewares/set-language';

import { controllerAuths } from '$controllers/auths';
import { controllerUploads } from '$controllers/uploads';

const app = new OpenAPIHono<Env>();

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT'
});

app.use('*', secureHeaders());
app.use('*', logger());

app.use(
	'*',
	cors({
		origin: '*'
	})
);

// app.use('*', csrf({ origin: '*' }));

app.use('*', deserializeUserMiddleware);
app.use('*', setLanguageMiddleware);

// Start: routes
app.route('auths', controllerAuths);
app.route('uploads', controllerUploads);
// End: routes

// Custom Not Found Message
app.notFound((c) => {
	return c.json({ message: 'Not Found', ok: false }, 404);
});

// Error handling
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		const HTTPError = err.getResponse();

		// Get the custom response
		return HTTPError;
	}

	console.error(`${err}`);
	return c.json({ message: 'System Error', ok: false }, 500);
});

app.doc31('/doc', (c) => ({
	openapi: '3.1.0',
	info: {
		version: '1.0.0',
		title: 'My API'
	},
	servers: [
		{
			url: new URL(c.req.url).origin,
			description: 'Current environment'
		}
	]
}));

app.get('/docs', swaggerUI({ url: '/doc' }));

const port = 3001;
console.log(`Server is running on port ${port}`);

app.get(
	'/statics/*',
	serveStatic({
		root: './',
		onNotFound: (path, c) => {
			console.log(`${path} is not found, request to ${c.req.path}`);
		}
	})
);

serve({
	fetch: app.fetch,
	port
});
