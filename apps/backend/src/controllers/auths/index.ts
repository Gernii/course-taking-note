import { OpenAPIHono } from '@hono/zod-openapi';

import { controllerAuthSignUp } from './sign-up';
import { controllerAuthSignIn } from './sign-in';
import { controllerAuthRefreshToken } from './refresh-token';
import { controllerAuthRefreshPassword } from './refresh-password';

export const controllerAuths = new OpenAPIHono();

controllerAuths.route('/', controllerAuthSignUp);
controllerAuths.route('/', controllerAuthSignIn);
controllerAuths.route('/', controllerAuthRefreshToken);
controllerAuths.route('/', controllerAuthRefreshPassword);
