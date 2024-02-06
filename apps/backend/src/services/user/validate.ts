import type { EnvBindings } from '$configs/type.config';

import { PGDBHandler } from '$databases/pg';

export interface UserValidateProps {
	username: string;
}

export const userValidate = async (env: EnvBindings, props: UserValidateProps) => {
	const { username } = props;

	const db = PGDBHandler(env);

	const user = await db
		.selectFrom('user')
		.select('id')
		.where('username', '=', username)
		.executeTakeFirst();

	return user;
};
