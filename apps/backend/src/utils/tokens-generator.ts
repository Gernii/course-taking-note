import { sign } from 'hono/jwt';

import type { SelectUserModel } from '$models/user';

export interface GenerateTokenProps extends Pick<SelectUserModel, 'id' | 'username'> {
	type: 'access' | 'refresh';
}

export const generateJWToken = (props: GenerateTokenProps, secret: string) => {
	const { id, type, username } = props;

	let exp = 0;

	switch (type) {
		case 'refresh':
			exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
			break;
		case 'access':
		default:
			exp = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes
	}

	return sign(
		{
			id,
			username,
			exp
		},
		secret
	);
};
