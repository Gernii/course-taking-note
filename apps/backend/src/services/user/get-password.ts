import type { EnvBindings } from '$configs/type.config';

import { PGDBHandler } from '$databases/pg';

export interface UserGetPasswordProps {
	username: string;
}

export const userGetPassword = async (env: EnvBindings, props: UserGetPasswordProps) => {
	const { username } = props;

	const db = PGDBHandler(env);

	const user = await db
		.selectFrom('user')
		.select(['id', 'password'])
		.where('username', '=', username)
		.executeTakeFirst();

	return user;
};
