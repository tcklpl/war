import { Game } from "../game";
import { LocalizationProvider } from "../localization/localization_provider";
import { Country } from "./objects/country";

export class GameBoard {

    private countries!: Country[];
    private selectedCountry?: Country;

    constructor() {
        this.initializeCountries();
        this.countries.forEach(c => c.parts.forEach(p => Game.instance.engine.interactions.registerInteractableObject(p)));
        this.registerAsRederable();
    }

    public set selected(country: Country) {
        if (this.selectedCountry == country) return;
        if (this.selectedCountry) {
            this.selectedCountry.fixed = false;
            this.selectedCountry.onMouseLeave();
        }
        country.fixed = true;
        country.onBoardSelection();
        this.selectedCountry = country;
    }

    private initializeCountries() {
        this.countries = [
            new Country('alsk', LocalizationProvider.locale.strings.country_alaska, ['map.Alaska_Cube.021']),
            new Country('cali', LocalizationProvider.locale.strings.country_california, ['map.Califórnia_Cube.013']),
            new Country('cuba', LocalizationProvider.locale.strings.country_cuba, ['map.Cuba_ilha_1_Cube.011', 'map.Cuba_ilha_2_Cube.012']),
            new Country('gren', LocalizationProvider.locale.strings.country_greenland, ['map.Groenlândia_Cube.003']),
            new Country('labr', LocalizationProvider.locale.strings.country_labrador, ['map.Labrador_Cube.015']),
            new Country('mack', LocalizationProvider.locale.strings.country_mackenzie, ['map.Mackenzie_Cube.023']),
            new Country('mexi', LocalizationProvider.locale.strings.country_mexico, ['map.México_Cube.009']),
            new Country('neyo', LocalizationProvider.locale.strings.country_newyork, ['map.Nova_York_Cube.010']),
            new Country('otta', LocalizationProvider.locale.strings.country_ottawa, ['map.Ottawa_Cube.018']),
            new Country('vanc', LocalizationProvider.locale.strings.country_vancouver, ['map.Vancouver_Cube.019']),
            
            new Country('arge', LocalizationProvider.locale.strings.country_argentina, ['map.Argentina_Cube.002']),
            new Country('braz', LocalizationProvider.locale.strings.country_brazil, ['map.Brasil_Cube.001']),
            new Country('chil', LocalizationProvider.locale.strings.country_chile, ['map.Chile_Cube.006']),
            new Country('vene', LocalizationProvider.locale.strings.country_venezuela, ['map.Venezuela_Cube.007']),

            new Country('germ', LocalizationProvider.locale.strings.country_germany, ['map.Alemanha_Cube.014']),
            new Country('fran', LocalizationProvider.locale.strings.country_france, ['map.França_Cube.008']),
            new Country('engl', LocalizationProvider.locale.strings.country_england, ['map.Inglaterra_Cube.005']),
            new Country('icel', LocalizationProvider.locale.strings.country_iceland, ['map.Islândia_Cube.004']),
            new Country('mosc', LocalizationProvider.locale.strings.country_moscow, ['map.Moscou_Cube.020']),
            new Country('pola', LocalizationProvider.locale.strings.country_poland, ['map.Polônia_Cube.017']),
            new Country('swed', LocalizationProvider.locale.strings.country_sweden, ['map.Suécia_Cube.022', 'map.Suécia_ilha_Cube.024']),

            new Country('aust', LocalizationProvider.locale.strings.country_australia, ['map.Austrália_Cube.040']),
            new Country('suma', LocalizationProvider.locale.strings.country_sumatra, ['map.Sumatra_ilha_1_Cube.043', 'map.Sumatra_ilha_2_Cube.045']),
            new Country('born', LocalizationProvider.locale.strings.country_borneo, ['map.Bornéu_ilha_1_Cube.047', 'map.Bornéu_ilha_2_Cube.041']),
            new Country('guin', LocalizationProvider.locale.strings.country_newguinea, ['map.Nova_Guiné_Cube.049']),

            new Country('egyp', LocalizationProvider.locale.strings.country_egypt, ['map.Egito_Cube.027']),
            new Country('alge', LocalizationProvider.locale.strings.country_algeria, ['map.Argélia_Cube.029']),
            new Country('suda', LocalizationProvider.locale.strings.country_sudan, ['map.Sudão_Cube.030']),
            new Country('cong', LocalizationProvider.locale.strings.country_congo, ['map.Congo_Cube.032']),
            new Country('soaf', LocalizationProvider.locale.strings.country_southafrica, ['map.África_do_Sul_Cube.034']),
            new Country('mada', LocalizationProvider.locale.strings.country_madagascar, ['map.Madagascar_Cube.036']),

            new Country('aral', LocalizationProvider.locale.strings.country_aral, ['map.Aral_Cube.028']),
            new Country('indi', LocalizationProvider.locale.strings.country_india, ['map.Índia_Cube.016']),
            new Country('orns', LocalizationProvider.locale.strings.country_ornsk, ['map.Omsk_Cube.025']),
            new Country('mide', LocalizationProvider.locale.strings.country_middleeast, ['map.Oriente_Médio_Cube.026']),
            new Country('viet', LocalizationProvider.locale.strings.country_vietnam, ['map.Vietnã_Cube.038']),
            new Country('chin', LocalizationProvider.locale.strings.country_china, ['map.China_Cube.042']),
            new Country('mong', LocalizationProvider.locale.strings.country_mongolia, ['map.Mongólia_Cube.044']),
            new Country('dudi', LocalizationProvider.locale.strings.country_dudinka, ['map.Dudinka_Cube.046']),
            new Country('tchi', LocalizationProvider.locale.strings.country_tchita, ['map.Tchita_Cube.048']),
            new Country('sibe', LocalizationProvider.locale.strings.country_siberia, ['map.Sibéria_Cube.051']),
            new Country('vlad', LocalizationProvider.locale.strings.country_vladvostok, ['map.Vladivostok_Cube.033', 'map.Vladivostok_ilha_Cube.031']),
            new Country('japa', LocalizationProvider.locale.strings.country_japan, ['map.Japão_ilha_1_Cube.035', 'map.Japão_ilha_3_Cube.037', 'map.Japão_ilha_2_Cube.039'])
        ]
    }

    private registerAsRederable() {
        this.countries.forEach(c => {
            c.parts.forEach(p => {
                Game.instance.engine.renderer.addVisible(p.obj);
            });
        });
    }

}