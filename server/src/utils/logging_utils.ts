
export default class svlog {

    static log(str: string) {
        const time = new Date();
        console.log(`[${time.toTimeString().split(' ')[0]}] [INFO] ${str}`);
    }

    static err(str: string) {
        const time = new Date();
        console.error(`[${time.toTimeString().split(' ')[0]}] [ERROR] ${str}`);
    }
}

