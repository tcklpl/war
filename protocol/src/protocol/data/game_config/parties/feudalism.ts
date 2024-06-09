import { PartyConfig } from "./party_config";

export interface PartyConfigFeudalism extends PartyConfig {

    passive: {}

    bonus: {
        /**
         * Number of troops that Feudalism will gain after conquering a territory.
         */
        troop_bonus_on_conquering: number;
    }

    debuffs: {}

    special_units: {
        dragon: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Number of turns before the dragon spawns again.
             */
            cooldown_after_dying: number;

            /**
             * Amount of max HP increase per turn until the Dragon's Max HP is what is configured.
             */
            hp_increase_rate_until_max_hp: number;

            /**
             * The amount of HP the Dragon will regenerate per turn when on a walled territory.
             */
            hp_recovery_on_walled_territory: number;
        }
    }

    special_abilities: {
        wall: {
            /**
             * Max number of walled countries that the Feudalism can have.
             */
            max_walled_countries: number;

            /**
             * Required number of sequential max-number attacking rolls to break the wall.
             */
            number_of_max_rolls_to_break: number;
        }
    }



}