import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'argon2';

import type { Env } from '$configs/type.config';

import { routeAuthSignIn } from '$routes/auths/sign-in';

import { generateJWToken } from '$utils/tokens-generator';
import { customHTTPException } from '$utils/create-custom-error-message';

import { userGetPassword } from '$services/user/get-password';

export const controllerAuthSignIn = new OpenAPIHono<Env>();

controllerAuthSignIn.openapi(routeAuthSignIn, async (c) => {
	const envDt = env(c);

	const { JWT_SECRET } = envDt;
	if (!JWT_SECRET) {
		throw customHTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'JWT_* is missing'
		});
	}

	const body = c.req.valid('json');

	const user = await userGetPassword(envDt, {
		username: body.username
	});

	if (!user) {
		throw customHTTPException(StatusCodes.BAD_REQUEST, {
			message: 'Invalid username or password'
		});
	}

	const isPasswordValid = await verify(user.password, body.password);

	if (!isPasswordValid) {
		throw customHTTPException(StatusCodes.BAD_REQUEST, {
			message: 'Invalid username or password'
		});
	}

	const accessToken = await generateJWToken(
		{
			id: user.id,
			username: body.username,
			type: 'access'
		},
		JWT_SECRET
	);

	const refreshToken = await generateJWToken(
		{
			id: user.id,
			username: body.username,
			type: 'refresh'
		},
		JWT_SECRET
	);

	return c.json({
		access_token: accessToken,
		refresh_token: refreshToken
	});
});
