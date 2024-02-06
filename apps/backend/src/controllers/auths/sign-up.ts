import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';

import type { Env } from '$configs/type.config';

import { routeAuthSignUp } from '$routes/auths/sign-up';

import { generateJWToken } from '$utils/tokens-generator';

import { userCreate } from '$services/user/create';
import { userValidate } from '$services/user/validate';

export const controllerAuthSignUp = new OpenAPIHono<Env>();

controllerAuthSignUp.openapi(routeAuthSignUp, async (c) => {
	const envDt = env(c);

	const { JWT_SECRET } = envDt;
	if (!JWT_SECRET) {
		throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'JWT_* is missing'
		});
	}
	const body = c.req.valid('json');

	const user = await userValidate(envDt, { username: body.username });

	if (user) {
		throw new HTTPException(StatusCodes.BAD_REQUEST, {
			message: 'Username already exists'
		});
	}

	const newUser = await userCreate(envDt, { password: body.password, username: body.username });

	if (!newUser) {
		throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'Failed to create user'
		});
	}

	const accessToken = await generateJWToken(
		{
			id: newUser.id,
			username: body.username,
			type: 'access'
		},
		JWT_SECRET
	);

	const refreshToken = await generateJWToken(
		{
			id: newUser.id,
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
