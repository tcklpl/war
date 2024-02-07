import { PartyConfig } from "./party_config";

export interface PartyConfigAnarchism extends PartyConfig {

    passive: {
        /**
         * Number of unoccupied countries that will fall into anarchism per round. 
         */
        unoccupied_country_conversion_base: number;
    }

    bonus: {
        /**
         * Number of troops that anarchism will gain after ending its turn. (Will be assigned at random)
         */
        troops_each_turns_end: number;

        /**
         * Dice bonus after successful attack.
         */
        attack_success_bonus: number;

        /**
         * Maximum number of times the attack success bonus can be stacked.
         */
        attack_success_bonus_max_stack: number;

        /**
         * Number of required successful sequential attacks to put victims into pressure;
         */
        number_of_successful_attacks_to_pressure: number;
    }

    debuffs: {}

    special_units: {
        black_block: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * The Black Block will be spawned after Anarchism loses this amount of territories.
             */
            number_of_lost_territories_required_to_spawn: number;

            /**
             * The amount of HP the Black Block will regenerate after having success in an attack. 
             */
            hp_recovery_on_successful_attack: number;
        }
    }

    special_abilities: {}

}