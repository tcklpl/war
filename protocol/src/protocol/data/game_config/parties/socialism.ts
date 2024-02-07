import { PartyConfig } from "./party_config";

export interface PartyConfigSocialism extends PartyConfig {

    passive: {
        /**
         * Minimum number of troops moving at once to allow for unlimited movement through allied territory.
         */
        min_troop_movement_size_to_allow_unlimited_movement: number;
    }

    bonus: {
        /**
         * Dice modifier when attacking or defending with numerical disadvantage.
         */
        dice_modifier_on_numerical_disadvantage: number;
    }

    debuffs: {

        /**
         * Number of troops required for "Famine" to start killing troops.
         */
        famine_starting_point: number;

        /**
         * Units that'll die per turn if the number of troops exceeds the starting point.
         */
        famine_units_to_die_per_turn: number;
    }

    special_units: {

        lula: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;
        }

        vladimir_lenin: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;
        }

        joseph_stalin: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Troops that can be converted to the red army per turn
             */
            gulag_troop_conversion_rate: number;
        }

        thomas_morus: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Required number of turns in Cuba to spawn the Utopia Island.
             */
            turns_in_cuba_to_spawn_utopia_island: number;
        }

        wilson: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Required number of sequential numerical rolls to evolve into "Red God"
             */
            required_numerical_roll_sequence_length: number;
        }

        red_god: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Dice roll bonus
             */
            dice_bonus: number;
        }
    }

    special_abilities: {
        tsar_bomb: {
            /**
             * Turns to cast the Tsar Bomb.
             */
            turns_to_cast: number;

            /**
             * Famine penalty multiplier while casting the Tsar Bomb.
             */
            famine_multiplier_while_casting: number;

            /**
             * Number of turns for the Tsar Bomb radiation to completely decay.
             */
            radiation_falloff_turns: number;
        }

        utopia_island: {

            /**
             * Number of new troops that will be granted per turn while the Utopia Island is active.
             */
            troops_per_turn: number;
        }
    }



}