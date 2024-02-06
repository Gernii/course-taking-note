import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface UserModel {
	// Columns that are generated by the database should be marked
	// using the `Generated` type. This way they are automatically
	// made optional in inserts and updates.
	id: string;

	username: string;

	password: string;

	// You can specify a different type for each operation (select, insert and
	// update) using the `ColumnType<SelectType, InsertType, UpdateType>`
	// wrapper. Here we define a column `created_at` that is selected as
	// a `Date`, can optionally be provided as a `string` in inserts and
	// can never be updated:
	created_at: ColumnType<Date, string | undefined, never>;
}

export type SelectUserModel = Selectable<UserModel>;
export type NewUserModel = Insertable<UserModel>;
export type UpdateUserModel = Updateable<UserModel>;
