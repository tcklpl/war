import { gray, underline } from './utils/color_utils';

export class WarServerBanner {
    readonly version = process.env.SERVER_VERSION;
    readonly sourceUrl = 'https://github.com/tcklpl/war';
    readonly greetings = `
        War2 Server ${gray(this.version ?? 'In-Development')}
        ${gray('Source available at ' + underline(this.sourceUrl))}
        Enter help to see the command list.
    `;
}
