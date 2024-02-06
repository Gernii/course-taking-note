import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { serve } from '@hono/node-server';

import './pre-init';
import type { Env } from '$configs/type.config';

import { deserializeUserMiddleware } from '$middlewares/deserialize-user.middleware';

import { authRoutes } from '$controllers/auths';

const app = new OpenAPIHono<Env>();

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT'
});

app.use('*', secureHeaders());

app.use(
	'*',
	cors({
		origin: '*'
	})
);

app.use('*', csrf({ origin: '*' }));

app.use('*', deserializeUserMiddleware);

// Start: routes
app.route('auths', authRoutes);
// End: routes

// Custom Not Found Message
app.notFound((c) => {
	return c.json({ message: 'Not Found', ok: false }, 404);
});

// Error handling
app.onError((err, c) => {
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

serve({
	fetch: app.fetch,
	port
});
