import { animatable } from ':engine/traits/animatable.trait';
import { transformable } from ':engine/traits/transformable.trait';
import { BCAlaska } from './board-countries/bc-alaska';
import { BCAlgeria } from './board-countries/bc-algeria';
import { BCAral } from './board-countries/bc-aral';
import { BCArgentina } from './board-countries/bc-argentina';
import { BCAustralia } from './board-countries/bc-australia';
import { BCBorneo } from './board-countries/bc-borneo';
import { BCBrazil } from './board-countries/bc-brazil';
import { BCCalifornia } from './board-countries/bc-california';
import { BCChile } from './board-countries/bc-chile';
import { BCChina } from './board-countries/bc-china';
import { BCCongo } from './board-countries/bc-congo';
import { BCCuba } from './board-countries/bc-cuba';
import { BCDudinka } from './board-countries/bc-dudinka';
import { BCEgypt } from './board-countries/bc-egypt';
import { BCEngland } from './board-countries/bc-england';
import { BCFrance } from './board-countries/bc-france';
import { BCGermany } from './board-countries/bc-germany';
import { BCGreenland } from './board-countries/bc-greenland';
import { BCIceland } from './board-countries/bc-iceland';
import { BCIndia } from './board-countries/bc-india';
import { BCJapan } from './board-countries/bc-japan';
import { BCLabrador } from './board-countries/bc-labrador';
import { BCMackenzie } from './board-countries/bc-mackenzie';
import { BCMadagascar } from './board-countries/bc-madagascar';
import { BCMexico } from './board-countries/bc-mexico';
import { BCMiddleEast } from './board-countries/bc-middle-east';
import { BCMongolia } from './board-countries/bc-mongolia';
import { BCMoscow } from './board-countries/bc-moscow';
import { BCNewGuinea } from './board-countries/bc-new-guinea';
import { BCNewYork } from './board-countries/bc-new-york';
import { BCOrnsk } from './board-countries/bc-ornsk';
import { BCOttawa } from './board-countries/bc-ottawa';
import { BCPoland } from './board-countries/bc-poland';
import { BCSiberia } from './board-countries/bc-siberia';
import { BCSouthAfrica } from './board-countries/bc-south-africa';
import { BCSudan } from './board-countries/bc-sudan';
import { BCSumatra } from './board-countries/bc-sumatra';
import { BCSweden } from './board-countries/bc-sweden';
import { BCTchita } from './board-countries/bc-tchita';
import { BCVancouver } from './board-countries/bc-vancouver';
import { BCVenezuela } from './board-countries/bc-venezuela';
import { BCVietnam } from './board-countries/bc-vietnam';
import { BCVladvostok } from './board-countries/bc-vladvostok';

export class BoardCountriesIndex extends transformable(animatable(class {})) {
	private readonly BoardCountries = {
		alaska: new BCAlaska(),
		algeria: new BCAlgeria(),
		aral: new BCAral(),
		argentina: new BCArgentina(),
		australia: new BCAustralia(),
		borneo: new BCBorneo(),
		brazil: new BCBrazil(),
		california: new BCCalifornia(),
		chile: new BCChile(),
		china: new BCChina(),
		congo: new BCCongo(),
		cuba: new BCCuba(),
		dudinka: new BCDudinka(),
		egypt: new BCEgypt(),
		england: new BCEngland(),
		france: new BCFrance(),
		germany: new BCGermany(),
		greenland: new BCGreenland(),
		iceland: new BCIceland(),
		india: new BCIndia(),
		japan: new BCJapan(),
		labrador: new BCLabrador(),
		mackenzie: new BCMackenzie(),
		madagascar: new BCMadagascar(),
		mexico: new BCMexico(),
		middle_east: new BCMiddleEast(),
		mongolia: new BCMongolia(),
		moscow: new BCMoscow(),
		new_guinea: new BCNewGuinea(),
		new_york: new BCNewYork(),
		ornsk: new BCOrnsk(),
		ottawa: new BCOttawa(),
		poland: new BCPoland(),
		siberia: new BCSiberia(),
		south_africa: new BCSouthAfrica(),
		sudan: new BCSudan(),
		sumatra: new BCSumatra(),
		sweden: new BCSweden(),
		tchita: new BCTchita(),
		vancouver: new BCVancouver(),
		venezuela: new BCVenezuela(),
		vietnam: new BCVietnam(),
		vladvostok: new BCVladvostok(),
	} as const;

	constructor() {
		super();
		this.allCountries.forEach(c => (c.parent = this));
	}

	getCountry<T extends keyof typeof this.BoardCountries>(country: T): (typeof this.BoardCountries)[T] {
		return this.BoardCountries[country];
	}

	get allCountries() {
		return Object.values(this.BoardCountries);
	}
}
