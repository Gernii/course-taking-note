import { HTTPException } from 'hono/http-exception';
import type { StatusCodes } from 'http-status-codes';

export interface DefaultHTTPExceptionMessage {
	message: string;
}

export const customHTTPException = <T extends object = DefaultHTTPExceptionMessage>(
	status: StatusCodes,
	message?: T,
	res?: Response
) => {
	return new HTTPException(status, {
		message: message ? JSON.stringify(message) : undefined,
		res
	});
};
