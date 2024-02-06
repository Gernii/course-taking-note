import { createFactory } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { env } from 'hono/adapter';
import { StatusCodes } from 'http-status-codes';

import type { Env } from '$configs/type.config';

const factory = createFactory<Env>();

export interface JWTTokenProps {
	exp: number;
	iat: number;
	nbf: string;
}

export interface AccessTokenProps extends JWTTokenProps {
	// Add attr
	username: string;
}

export interface RefreshToken extends JWTTokenProps {
	// Add attr
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
		const userData: AccessTokenProps = await verify(accessToken, JWT_SECRET);
		c.set('user', userData);
		await next();
	} catch (e) {
		throw new HTTPException(StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' });
	}
});
