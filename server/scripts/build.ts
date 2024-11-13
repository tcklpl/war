import { $ } from 'bun';
import { exit } from 'node:process';
import path from 'path';
import packageJson from '../package.json' with { type: 'json' };

// Colors
const cRed = Bun.color('red', 'ansi');
const cGray = Bun.color('gray', 'ansi');
const cCyan = Bun.color('cyan', 'ansi');
const cGreen = Bun.color('green', 'ansi');

// Util functions and paths
const resolvePath = relativePath => path.resolve(process.cwd(), relativePath);
const buildPath = resolvePath('build');

console.log(`🛠️ ${cCyan} Starting build...`);

// Get version from package.json
const version = packageJson.version;
process.env.SERVER_VERSION = version;

buildServer();

async function buildServer() {
    console.log(`${cGray}Building server version ${version}...`);

    console.log(`${cGray}1/4 - Typecheck files`);
    await typecheck();

    console.log(`${cGray}2/4 - Build server - win x64`);
    await build('bun-windows-x64', `War2 Server win x64 v${version}`);
    console.log(`${cGray}3/4 - Build server - linux x64`);
    await build('bun-linux-x64', `War2 Server linux x64 v${version}`);
    console.log(`${cGray}4/4 - Build server - darwin x64`);
    await build('bun-darwin-x64', `War2 Server darwin x64 v${version}`);

    console.log(`✔️ ${cGreen} Successfully built`);
}

async function typecheck() {
    try {
        await $`bunx tsc --build`;
    } catch {
        console.log(`❌ ${cRed} Failed to typecheck project`);
        exit(1);
    }
}

async function build(target: string, outFile: string) {
    try {
        await $`bun build --compile --minify --sourcemap --asset-naming='[name].[ext]' --target=${target} --define=process.env.SERVER_VERSION=${version} src/index.ts --outfile 'dist/${outFile}'`;
    } catch {
        console.log(`❌ ${cRed} Failed to compile project for target ${target}`);
        exit(1);
    }
}
