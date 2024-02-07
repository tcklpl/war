import { PartyConfigAnarchism } from "./parties/anarchism"
import { PartyConfigCapitalism } from "./parties/capitalism";
import { PartyConfigFeudalism } from "./parties/feudalism";
import { PartyConfigSocialism } from "./parties/socialism";

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
    }

}