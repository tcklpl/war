import { $ } from 'bun';
import { exit } from 'process';

// Colors
const cRed = Bun.color('red', 'ansi');
const cCyan = Bun.color('cyan', 'ansi');
const cGreen = Bun.color('green', 'ansi');

console.log(`🧹 ${cCyan} Clearing output folder...`);

try {
    await $`rm -rf dist`;
} catch {
    console.log(`❌ ${cRed} Failed remove output folder`);
    exit(1);
}

console.log(`🗑️ ${cGreen} Cleared all output folders`);

export {};
