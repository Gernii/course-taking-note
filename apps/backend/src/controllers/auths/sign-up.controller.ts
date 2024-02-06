import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { sign } from 'hono/jwt';
import { hash } from 'argon2';

import type { Env } from '$configs/type.config';

import { PGDBHandler } from '$databases/pg.database';

import type { NewUserModel } from '$models/users.models';

import { signUpBodySchema, signUpResponseSchema } from '$schemas/auths/sign-up.schema';

export const authSignUpHandler = new OpenAPIHono<Env>();

const route = createRoute({
	method: 'post',
	path: 'signup',
	request: {
		body: {
			content: {
				'application/json': {
					schema: signUpBodySchema
				}
			},
			description: 'Sign up the user'
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: signUpResponseSchema
				}
			},
			description: 'Response about sign up'
		}
	},
	tags: ['Auths']
});

authSignUpHandler.openapi(route, async (c) => {
	const envDt = env(c);

	const { JWT_SECRET } = envDt;
	if (!JWT_SECRET) {
		throw new HTTPException(500, {
			message: 'JWT_* is missing'
		});
	}
	const body = c.req.valid('json');

	const db = PGDBHandler(envDt);
	const user = await db
		.selectFrom('user')
		.select('id')
		.where('username', '=', body.username)
		.executeTakeFirst();

	if (user) {
		throw new HTTPException(400, {
			message: 'Username already exists'
		});
	}

	const userNewId = nanoid();
	const hassedPassword = await hash(body.password);

	const createUser: NewUserModel = {
		username: body.username,
		password: hassedPassword,
		id: userNewId
	};

	const newUser = await db.insertInto('user').values(createUser).returning('id').executeTakeFirst();

	if (!newUser) {
		throw new HTTPException(500, {
			message: 'Failed to create user'
		});
	}

	const accessToken = await sign(
		{
			username: body.username,
			exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
			id: userNewId
		},
		JWT_SECRET
	);

	const refreshToken = await sign(
		{
			username: body.username,
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
			id: userNewId
		},
		JWT_SECRET
	);

	return c.json({
		access_token: accessToken,
		refresh_token: refreshToken
	});
});
