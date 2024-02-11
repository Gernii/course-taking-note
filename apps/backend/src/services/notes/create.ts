import { nanoid } from 'nanoid';

import type { EnvBindings } from '$configs/type.config';

import { PGDBHandler } from '$databases/pg';

import type { NewNoteModel } from '$models/note';

export interface NoteCreateProps {
	userId: string;
}

export const noteCreate = async (env: EnvBindings, props: NoteCreateProps) => {
	const { userId } = props;
	const db = PGDBHandler(env);

	const noteNewId = nanoid();

	const newNoteValues: NewNoteModel = {
		id: noteNewId,
		user_id: userId,
		content: {}
	};

	const newNote = await db
		.insertInto('note')
		.values(newNoteValues)
		.returning('id')
		.executeTakeFirst();

	return newNote;
};
