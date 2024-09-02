'use strict';

import chalk from 'chalk';
import fs from 'fs-jetpack';

console.log(chalk.yellow(`Clearing output folders...`));

const outputFolders = ['build', 'dist'];
for (const folder of outputFolders) {
    fs.remove(folder);
}

console.log(chalk.green(`Cleared all output folders`));
