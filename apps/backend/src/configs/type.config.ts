import type { AccessTokenProps } from '$middlewares/deserialize-user.middleware';

export type EnvBindings = {
	JWT_SECRET?: string;
	PG_DATABASE?: string;
	PG_PASSWORD?: string;
	PG_HOST?: string;
	PG_USER?: string;
	PG_PORT?: number;
};
export type EnvVariabless = {
	user: AccessTokenProps;
};

export type Env = {
	Variables: EnvVariabless;
	Bindings: EnvBindings;
};
