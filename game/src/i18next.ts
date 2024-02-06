import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import countries_enUS from './locales/en-US/countries.json';
import loading_enUS from './locales/en-US/loading.json';
import engine_enUS from './locales/en-US/engine.json';
import config_enUS from "./locales/en-US/config.json";
import server_list_enUS from "./locales/en-US/server_list.json";
import common_enUS from "./locales/en-US/common.json";
import lobby_enUS from "./locales/en-US/lobby.json";

export const defaultNS = 'ns1';

export const resources = {
    en: {
        countries: countries_enUS,
        loading: loading_enUS,
        engine: engine_enUS,
        config: config_enUS,
        server_list: server_list_enUS,
        lobby: lobby_enUS,
        common: common_enUS
    }
};

i18next.use(initReactI18next).init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: false,
    fallbackLng: 'en', // use en if detected lng is not available
    saveMissing: true, // send not translated keys to endpoint
    resources,
    defaultNS,
});

export default i18next;