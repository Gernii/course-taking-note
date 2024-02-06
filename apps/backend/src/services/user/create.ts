import { hash } from 'argon2';
import { nanoid } from 'nanoid';

import type { EnvBindings } from '$configs/type.config';

import { PGDBHandler } from '$databases/pg';

import type { NewUserModel } from '$models/user';

export interface UserCreateProps {
	password: string;
	username: string;
}

export const userCreate = async (env: EnvBindings, props: UserCreateProps) => {
	const { password, username } = props;

	const db = PGDBHandler(env);

	const userNewId = nanoid();
	const hassedPassword = await hash(password);

	const createUser: NewUserModel = {
		username,
		password: hassedPassword,
		id: userNewId
	};

	const newUser = await db.insertInto('user').values(createUser).returning('id').executeTakeFirst();

	return newUser;
};
