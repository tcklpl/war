import chalk from 'chalk';

export class WarServerBanner {
    readonly version = process.env.SERVER_VERSION;
    readonly version_type: 'Development' | 'Release' = 'Development';
    readonly source_url = 'https://github.com/tcklpl/war';
    readonly greetings = `
        War Server ${chalk.gray(this.version)} (${chalk.gray(this.version_type)})
        ${chalk.dim('Source available at ' + chalk.underline(this.source_url))}
        ${chalk.dim('Enter help to see the command list.')}
    `;
}
