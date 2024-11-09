'use strict';

import packageJson from '../package.json' with { type: 'json' };

import chalk from 'chalk';
import fs from 'fs-jetpack';
import path from 'path';
import childProcess from 'child_process';
import { replaceInFileSync } from 'replace-in-file';

// Util functions and paths
const resolvePath = relativePath => path.resolve(process.cwd(), relativePath);
const buildPath = resolvePath('build');

console.log(chalk.cyan('🛠️  Starting build...'));

// Get version from package.json
const version = packageJson.version;
process.env.SERVER_VERSION = version;

// Variables to "burn-in"
const envsToBurnIn = new Map([['SERVER_VERSION', version]]);

buildServer();

async function buildServer() {
    console.log(chalk.gray(`Building server version ${version}...`));

    console.log(chalk.gray('1/4 - Clear previous build'));
    clearPreviousBuild();

    console.log(chalk.gray('2/4 - Build Typescript files'));
    build();

    console.log(chalk.gray('3/4 - Copy assets'));
    copyAssets();

    console.log(chalk.gray('4/4 - Burn in parameters'));
    burnInInfo();

    console.log(chalk.green(`✔️  Successfully built`));
}

function clearPreviousBuild() {
    fs.remove(buildPath);
}

function build() {
    childProcess.execSync('npx tsc --build');
}

function copyAssets() {
    childProcess.execSync('npx copyfiles -u 1 src/**/*.json5 build');
}

function burnInInfo() {
    const burnInParams = [...envsToBurnIn.entries()].map(replacement => {
        return {
            files: 'build/**/*.*',
            from: `process.env.${replacement[0]}`,
            to: `'${replacement[1]}'`,
        };
    });
    for (const param of burnInParams) {
        replaceInFileSync(param);
    }
}
