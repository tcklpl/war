import { PartyConfig } from "./party_config";

export interface PartyConfigCapitalism extends PartyConfig {

    passive: {
        /**
         * Number of troops gained with each territory trade.
         */
        troop_gain_per_territory_trade: number;
    }

    bonus: {
        /**
         * Multiplier to the continental bonus.
         */
        continental_bonus_multiplier: number;
    }

    debuffs: {

        /**
         * Number of sequential loses to initiate a crisis.
         */
        crisis_sequential_loses: number;

        /**
         * Turns that the capitalist territories will be in crisis.
         */
        crisis_duration: number;
    }

    special_units: {

        john_keynes: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * John Keynes territory troop multiplication factor.
             */
            troop_multiplier: number;

            /**
             * Troop multiplication turn cooldown.
             */
            troop_multiplication_cooldown: number;
        }

        ray_croc: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Cooldown to force some party to sell a country for 1 troop.
             */
            force_country_buy_cooldown: number;
        }

        mark_zuckerberg: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Number of troops that will be converted per turn.
             */
            social_network_troop_conversion_rate: number;

            /**
             * Cooldown to create a social network in another country.
             */
            create_social_network_cooldown: number;
        }

        steve_jobs: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Number of troops that will be invalidated per turn.
             */
            troop_invalidation_rate: number;

            /**
             * Cooldown to create another Store.
             */
            create_store_cooldown: number;
        }

        donald_trump: {
            /**
             * Unit hit points.
             */
            hp: number;

            /**
             * Unit max HP
             */
            max_hp: number;

            /**
             * Territory defense modifier when Trump is in the territory.
             */
            territory_defense_modifier: number;
        }
    }

    special_abilities: {
        privatization: {
            /**
             * Cooldown to try another privatization
             */
            cooldown: number;

            /**
             * Allow control of special units.
             */
            allow_using_specials: boolean;
        }
    }
}