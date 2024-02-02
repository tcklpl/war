import chalk from "chalk";

export default class svlog {

    private static getCurrentTimeString() {
        const time = new Date();
        return chalk.gray(time.toTimeString().split(' ')[0]);
    }

    static log(str: string) {
        const time = new Date();
        console.log(`[${this.getCurrentTimeString()}] [${chalk.gray("INFO")}] ${str}`);
    }

    static err(str: string) {
        console.error(`[${this.getCurrentTimeString()}] [${chalk.red("ERROR")}] ${str}`);
    }
}

