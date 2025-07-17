import type { PartyConfigAnarchism } from './parties/anarchism';
import type { PartyConfigCapitalism } from './parties/capitalism';
import type { PartyConfigFeudalism } from './parties/feudalism';
import type { PartyConfigSocialism } from './parties/socialism';

export interface GameConfig {
	/**
	 * If the server defined this config is immutable
	 */
	is_immutable: boolean;

	/**
	 * Max time allowed per turn per player.
	 */
	turn_timeout_seconds: number;

	/**
	 * Config for each playable party
	 */
	party_config: {
		anarchism: PartyConfigAnarchism;
		feudalism: PartyConfigFeudalism;
		socialism: PartyConfigSocialism;
		capitalism: PartyConfigCapitalism;
	};
}
