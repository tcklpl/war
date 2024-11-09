'use strict';

import packageJson from '../package.json' with { type: 'json' };

import chalk from 'chalk';
import nodemon from 'nodemon';

// Get version from package.json
const version = packageJson.version;
process.env.SERVER_VERSION = version;

console.log(chalk.cyan(`Starting development server for ${packageJson.name} v${version}...`));

nodemon({
    script: 'src/index.ts',
});
