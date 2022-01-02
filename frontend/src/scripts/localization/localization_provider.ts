import { GameLocale } from "./locale";

export class LocalizationProvider {

    private static currentLocale?: string;
    private static locales: GameLocale[];
    static locale: GameLocale;

    static initialize(localeList: GameLocale[]) {
        this.locales = localeList;
        this.locale = localeList[0];
    }

    static setLocale(toWhere: string) {
        this.locale = this.locales.find(l => l.language == toWhere) || this.locale;
    }

    static localeLoadedCallback: () => void;

    static isLoaded(): boolean {
        return this.locale != undefined;
    }

}