export class GameLocale {

    strings: any;
    language: string;

    constructor(language: string, strings: any) {
        this.language = language;
        this.strings = strings;
    }
}