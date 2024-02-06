import type { AccessTokenProps } from '$middlewares/deserialize-user.middleware';

export type Env = {
	Variables: {
		user: AccessTokenProps;
	};
	Bindings: {
		JWT_SECRET?: string;
		PG_DATABASE?: string;
		PG_PASSWORD?: string;
		PG_HOST?: string;
		PG_USER?: string;
		PG_PORT?: number;
	};
};
