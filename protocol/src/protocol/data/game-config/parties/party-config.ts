type ConfigValueType = number | boolean;

export interface PartyConfig {
	passive: {
		[x: string]: ConfigValueType;
	};

	bonus: {
		[x: string]: ConfigValueType;
	};

	debuffs: {
		[x: string]: ConfigValueType;
	};

	special_units: {
		[x: string]: {
			hp: number;
			max_hp: number;
			[x: string]: ConfigValueType;
		};
	};

	special_abilities: {
		[x: string]: {
			[x: string]: ConfigValueType;
		};
	};
}
