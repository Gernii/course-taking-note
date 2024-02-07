import { hash } from 'argon2';

import type { EnvBindings } from '$configs/type.config';

import { PGDBHandler } from '$databases/pg';

import type { UpdateUserModel } from '$models/user';

export interface UserCreateProps {
	password: string;
	id: string;
}

export const userUpdatePassword = async (env: EnvBindings, props: UserCreateProps) => {
	const { password, id } = props;

	const db = PGDBHandler(env);

	const hassedPassword = await hash(password);

	const updateUser: UpdateUserModel = {
		password: hassedPassword
	};
	console.log(id);

	const updatedUser = await db
		.updateTable('user')
		.set(updateUser)
		.where('id', '=', id)
		.returning('id')
		.executeTakeFirst();

	return updatedUser;
};
