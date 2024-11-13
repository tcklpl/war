function colorString(str: string, col: string | null, resetSequence?: string) {
    const cReset = resetSequence ?? `\x1b[39m`;
    return `${col}${str}${cReset}`;
}

export function red(str: string) {
    return colorString(str, Bun.color('red', 'ansi'));
}

export function yellow(str: string) {
    return colorString(str, Bun.color('yellow', 'ansi'));
}

export function green(str: string) {
    return colorString(str, Bun.color('green', 'ansi'));
}

export function lime(str: string) {
    return colorString(str, Bun.color('lime', 'ansi'));
}

export function blue(str: string) {
    return colorString(str, Bun.color('blue', 'ansi'));
}

export function lightBlue(str: string) {
    return colorString(str, Bun.color('lightblue', 'ansi'));
}

export function gray(str: string) {
    return colorString(str, Bun.color('gray', 'ansi'));
}

export function white(str: string) {
    return colorString(str, Bun.color('white', 'ansi'));
}

export function underline(str: string) {
    return colorString(str, '\x1b[4m', '\x1b[24m');
}
