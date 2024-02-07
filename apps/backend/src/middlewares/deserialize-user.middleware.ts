import { createFactory } from 'hono/factory';
import { verify } from 'hono/jwt';
import { env } from 'hono/adapter';
import { StatusCodes } from 'http-status-codes';

import type { Env } from '$configs/type.config';

import { customHTTPException } from '$utils/create-custom-error-message';

const factory = createFactory<Env>();

export interface JWTTokenProps {
	exp: number;
	iat: number;
	nbf: string;

	// Add attr
	id: string;
	username: string;
}

export const deserializeUserMiddleware = factory.createMiddleware(async (c, next) => {
	const { JWT_SECRET } = env(c);

	const accessToken = c.req.header('authorization')?.replace(/^Bearer\s/, '');
	console.log('accessToken', accessToken);

	// const refreshToken = c.req.header('x-refresh');
	if (!accessToken || !JWT_SECRET) {
		return next();
	}

	try {
		const userData: JWTTokenProps = await verify(accessToken, JWT_SECRET);
		c.set('user', userData);
		await next();
	} catch (e) {
		throw customHTTPException(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	}
});
