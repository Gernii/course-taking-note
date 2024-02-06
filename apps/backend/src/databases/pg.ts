import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';

import type { EnvBindings } from '$configs/type.config';

import type { UserModel } from '$models/user';

export interface Database {
	user: UserModel;
}

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
let dbConnection: Kysely<Database> | null = null;

const connectPGDatabase = (config: EnvBindings) => {
	const { PG_DATABASE, PG_HOST, PG_USER, PG_PORT, PG_PASSWORD } = config;
	if (
		PG_DATABASE === undefined ||
		PG_HOST === undefined ||
		PG_USER === undefined ||
		PG_PORT === undefined ||
		PG_PASSWORD === undefined
	) {
		throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: 'PG_* is missing'
		});
	}
	const dialect = new PostgresDialect({
		pool: async () =>
			new Pool({
				database: PG_DATABASE,
				host: PG_HOST,
				user: PG_USER,
				port: PG_PORT,
				password: PG_PASSWORD
			})
	});
	dbConnection = new Kysely<Database>({
		dialect
	});

	return dbConnection;
};

export const PGDBHandler = (config: EnvBindings) => dbConnection ?? connectPGDatabase(config);
