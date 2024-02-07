import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'hono/jwt';

import type { Env } from '$configs/type.config';

import { routeAuthRefreshToken } from '$routes/auths/refresh-token';

import { generateJWToken } from '$utils/tokens-generator';
import { customHTTPException } from '$utils/create-custom-error-message';

import type { JWTTokenProps } from '$middlewares/deserialize-user.middleware';

import { userValidate } from '$services/user/validate';

export const controllerAuthRefreshToken = new OpenAPIHono<Env>();

controllerAuthRefreshToken.openapi(routeAuthRefreshToken, async (c) => {
	const envDt = env(c);

	const { JWT_SECRET } = envDt;
	if (!JWT_SECRET) {
		throw customHTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'JWT_* is missing'
		});
	}

	const body = c.req.valid('json');

	let tokenData: JWTTokenProps;
	try {
		tokenData = await verify(body.refresh_token, JWT_SECRET);
	} catch (err) {
		throw customHTTPException(StatusCodes.UNAUTHORIZED, {
			message: 'Unauthorized'
		});
	}

	// Check if user exists in DB
	const user = await userValidate(envDt, { username: tokenData.username });

	if (!user) {
		throw customHTTPException(StatusCodes.UNAUTHORIZED, {
			message: 'Unauthorized'
		});
	}

	const accessToken = await generateJWToken(
		{
			id: user.id,
			username: tokenData.username,
			type: 'access'
		},
		JWT_SECRET
	);

	return c.json({
		access_token: accessToken
	});
});
