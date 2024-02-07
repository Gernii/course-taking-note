import { OpenAPIHono } from '@hono/zod-openapi';

import { controllerAuthSignUp } from './sign-up';
import { controllerAuthSignIn } from './sign-in';
import { controllerAuthRefreshToken } from './refresh-token';
import { controllerAuthRefreshPassword } from './refresh-password';

export const routeAuths = new OpenAPIHono();

routeAuths.route('/', controllerAuthSignUp);
routeAuths.route('/', controllerAuthSignIn);
routeAuths.route('/', controllerAuthRefreshToken);
routeAuths.route('/', controllerAuthRefreshPassword);
