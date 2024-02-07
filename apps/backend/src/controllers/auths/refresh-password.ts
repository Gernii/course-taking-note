import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'argon2';

import type { Env } from '$configs/type.config';

import { routeAuthRefreshPassword } from '$routes/auths/refresh-password';

import { customHTTPException } from '$utils/create-custom-error-message';

import { userUpdatePassword } from '$services/user/update-password';
import { userGetPassword } from '$services/user/get-password';

export const controllerAuthRefreshPassword = new OpenAPIHono<Env>();

controllerAuthRefreshPassword.openapi(routeAuthRefreshPassword, async (c) => {
	const envDt = env(c);

	const { JWT_SECRET } = envDt;
	if (!JWT_SECRET) {
		throw customHTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'JWT_* is missing'
		});
	}

	const body = c.req.valid('json');

	if (body.password === body.new_password) {
		throw customHTTPException(StatusCodes.BAD_REQUEST, {
			message: 'Password and new password are the same'
		});
	}

	let username: string | undefined = undefined;

	const userToken = c.var.user;
	if (userToken) {
		username = userToken.username;
	} else if (body.username) {
		username = body.username;
	}

	if (!username) {
		throw customHTTPException(StatusCodes.UNAUTHORIZED, {
			message: JSON.stringify({ message: 'Username is missing' })
		});
	}

	// Check if user exists in DB
	const userValid = await userGetPassword(envDt, { username });
	console.log(userValid);

	if (!userValid) {
		throw customHTTPException(StatusCodes.OK);
	}

	const isPasswordValid = await verify(userValid.password, body.password);

	if (!isPasswordValid) {
		throw customHTTPException(StatusCodes.BAD_REQUEST, {
			message: 'Your password is invalid'
		});
	}

	const userUpdated = userUpdatePassword(envDt, {
		id: userValid.id,
		password: body.new_password
	});

	if (!userUpdated) {
		throw customHTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'Error updating password'
		});
	}
	return c.json({ message: 'Password updated' });
});
