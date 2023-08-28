import { EmptyEntity } from "../../engine/data/entity/empty_entity";
import { BCAlaska } from "./board_countries/bc_alaska";
import { BCAlgeria } from "./board_countries/bc_algeria";
import { BCAral } from "./board_countries/bc_aral";
import { BCArgentina } from "./board_countries/bc_argentina";
import { BCAustralia } from "./board_countries/bc_australia";
import { BCBorneo } from "./board_countries/bc_borneo";
import { BCBrazil } from "./board_countries/bc_brazil";
import { BCCalifornia } from "./board_countries/bc_california";
import { BCChile } from "./board_countries/bc_chile";
import { BCChina } from "./board_countries/bc_china";
import { BCCongo } from "./board_countries/bc_congo";
import { BCCuba } from "./board_countries/bc_cuba";
import { BCDudinka } from "./board_countries/bc_dudinka";
import { BCEgypt } from "./board_countries/bc_egypt";
import { BCEngland } from "./board_countries/bc_england";
import { BCFrance } from "./board_countries/bc_france";
import { BCGermany } from "./board_countries/bc_germany";
import { BCGreenland } from "./board_countries/bc_greenland";
import { BCIceland } from "./board_countries/bc_iceland";
import { BCIndia } from "./board_countries/bc_india";
import { BCJapan } from "./board_countries/bc_japan";
import { BCLabrador } from "./board_countries/bc_labrador";
import { BCMackenzie } from "./board_countries/bc_mackenzie";
import { BCMadagascar } from "./board_countries/bc_madagascar";
import { BCMexico } from "./board_countries/bc_mexico";
import { BCMiddleEast } from "./board_countries/bc_middle_east";
import { BCMongolia } from "./board_countries/bc_mongolia";
import { BCMoscow } from "./board_countries/bc_moscow";
import { BCNewGuinea } from "./board_countries/bc_new_guinea";
import { BCNewYork } from "./board_countries/bc_new_york";
import { BCOrnsk } from "./board_countries/bc_ornsk";
import { BCOttawa } from "./board_countries/bc_ottawa";
import { BCPoland } from "./board_countries/bc_poland";
import { BCSiberia } from "./board_countries/bc_siberia";
import { BCSouthAfrica } from "./board_countries/bc_south_africa";
import { BCSudan } from "./board_countries/bc_sudan";
import { BCSumatra } from "./board_countries/bc_sumatra";
import { BCSweden } from "./board_countries/bc_sweden";
import { BCTchita } from "./board_countries/bc_tchita";
import { BCVancouver } from "./board_countries/bc_vancouver";
import { BCVenezuela } from "./board_countries/bc_venezuela";
import { BCVietnam } from "./board_countries/bc_vietnam";
import { BCVladvostok } from "./board_countries/bc_vladvostok";

export class BoardCountriesIndex extends EmptyEntity {

    private BoardCountries = {
        "Alaska": new BCAlaska(),
        "Algeria": new BCAlgeria(),
        "Aral": new BCAral(),
        "Argentina": new BCArgentina(),
        "Australia": new BCAustralia(),
        "Borneo": new BCBorneo(),
        "Brazil": new BCBrazil(),
        "California": new BCCalifornia(),
        "Chile": new BCChile(),
        "China": new BCChina(),
        "Congo": new BCCongo(),
        "Cuba": new BCCuba(),
        "Dudinka": new BCDudinka(),
        "Egypt": new BCEgypt(),
        "England": new BCEngland(),
        "France": new BCFrance(),
        "Germany": new BCGermany(),
        "Greenland": new BCGreenland(),
        "Iceland": new BCIceland(),
        "India": new BCIndia(),
        "Japan": new BCJapan(),
        "Labrador": new BCLabrador(),
        "Mackenzie": new BCMackenzie(),
        "Madagascar": new BCMadagascar(),
        "Mexico": new BCMexico(),
        "MiddleEast": new BCMiddleEast(),
        "Mongolia": new BCMongolia(),
        "Moscow": new BCMoscow(),
        "NewGuinea": new BCNewGuinea(),
        "NewYork": new BCNewYork(),
        "Ornsk": new BCOrnsk(),
        "Ottawa": new BCOttawa(),
        "Poland": new BCPoland(),
        "Siberia": new BCSiberia(),
        "SouthAfrica": new BCSouthAfrica(),
        "Sudan": new BCSudan(),
        "Sumatra": new BCSumatra(),
        "Sweden": new BCSweden(),
        "Tchita": new BCTchita(),
        "Vancouver": new BCVancouver(),
        "Venezuela": new BCVenezuela(),
        "Vietnam": new BCVietnam(),
        "Vladvostok": new BCVladvostok(),
    } as const;


    constructor() {
        super({
            name: 'Country container'
        });

        this.allCountries.forEach(c => c.parent = this);
    }

    getCountry<T extends keyof typeof this.BoardCountries>(country: T): typeof this.BoardCountries[T] {
        return this.BoardCountries[country];
    }

    get allCountries() {
        return Object.values(this.BoardCountries);
    }

}