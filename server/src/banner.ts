import { c } from 'tasai';

export class WarServerBanner {
    readonly version = process.env.SERVER_VERSION;
    readonly sourceUrl = 'https://github.com/tcklpl/war';
    readonly greetings = `
        War2 Server ${c.dim(this.version ?? 'In-Development')} ${c.dim('@ Bun')} ${c.dim(Bun.version)}
        ${c.dim('Source available at ' + c.underline(this.sourceUrl))}
        Enter help to see the command list.
    `;
}
