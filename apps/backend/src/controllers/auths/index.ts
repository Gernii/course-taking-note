import { OpenAPIHono } from '@hono/zod-openapi';

import { controllerAuthSignUp } from './sign-up';
import { controllerAuthSignIn } from './sign-in';

export const routeAuths = new OpenAPIHono();

routeAuths.route('/', controllerAuthSignUp);
routeAuths.route('/', controllerAuthSignIn);
