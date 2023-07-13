import loadingKeys from '../../locales/en-US/loading.json';

type LoadingTranslationKey = keyof typeof loadingKeys;

export class LoadingState {

    static INITIALIZING = new LoadingState(0, 'initializing', 'initializing');
    static FETCHING_ASSETS = new LoadingState(1, 'feching assets', 'fetching_assets');

    stage: number;
    name: string;
    locale_key: LoadingTranslationKey;

    private constructor(stage: number, name: string, locale_key: LoadingTranslationKey) {
        this.stage = stage;
        this.name = name;
        this.locale_key = locale_key;
    }

}