import type { JWTTokenProps } from '$middlewares/deserialize-user.middleware';

export type EnvBindings = {
	JWT_SECRET?: string;
	PG_DATABASE?: string;
	PG_PASSWORD?: string;
	PG_HOST?: string;
	PG_USER?: string;
	PG_PORT?: number;
};
export type EnvVariabless = {
	user?: JWTTokenProps;
};

export type Env = {
	Variables: EnvVariabless;
	Bindings: EnvBindings;
};
