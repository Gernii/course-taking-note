import * as path from 'path';

import { configDotenv } from 'dotenv';

const option = {
	env: 'dev'
};

const setEnvFile = configDotenv({
	path: path.join(__dirname, `../env/.env.${option.env}`)
});

if (setEnvFile.error) {
	throw setEnvFile.error;
}
