import { OpenAPIHono } from '@hono/zod-openapi';

import { authSignUpHandler } from './sign-up.controller';

export const authRoutes = new OpenAPIHono();

// authRoutes.route('/', authSignInRoute);
authRoutes.route('/', authSignUpHandler);
