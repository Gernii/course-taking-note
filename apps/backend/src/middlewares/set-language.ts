import { createFactory } from 'hono/factory';

import type { AvailableLanguageTag } from '$libs/i18n/messages/runtime';
import {
	availableLanguageTags,
	setLanguageTag,
	sourceLanguageTag
} from '$libs/i18n/messages/runtime';

const factory = createFactory();

export const setLanguageMiddleware = factory.createMiddleware(async (c, next) => {
	const lang = c.req.query('lang') as AvailableLanguageTag | undefined;

	if (!lang || !availableLanguageTags.includes(lang as AvailableLanguageTag)) {
		setLanguageTag(sourceLanguageTag);
	} else {
		setLanguageTag(lang);
	}

	return next();
});
