import { GraphNodeTerritoryPacket, GraphTerritoryPacket } from "../../../../protocol";
import { Graph } from "../../graph/graph";
import svlog from "../../utils/logging_utils";
import { Territory } from "../territory/territory";

export class Board {

    readonly graph = new Graph<Territory>();

    readonly territories = {
        alaska: this.graph.addNode(new Territory("alaska", "n_america")),
        california: this.graph.addNode(new Territory("california", "n_america")),
        cuba: this.graph.addNode(new Territory("cuba", "n_america")),
        greenland: this.graph.addNode(new Territory("greenland", "n_america")),
        labrador: this.graph.addNode(new Territory("labrador", "n_america")),
        mackenzie: this.graph.addNode(new Territory("mackenzie", "n_america")),
        mexico: this.graph.addNode(new Territory("mexico", "n_america")),
        new_york: this.graph.addNode(new Territory("new_york", "n_america")),
        ottawa: this.graph.addNode(new Territory("ottawa", "n_america")),
        vancouver: this.graph.addNode(new Territory("vancouver", "n_america")),

        argentina: this.graph.addNode(new Territory("argentina", "s_america")),
        brazil: this.graph.addNode(new Territory("brazil", "s_america")),
        chile: this.graph.addNode(new Territory("chile", "s_america")),
        venezuela: this.graph.addNode(new Territory("venezuela", "s_america")),

        germany: this.graph.addNode(new Territory("germany", "europe")),
        france: this.graph.addNode(new Territory("france", "europe")),
        england: this.graph.addNode(new Territory("england", "europe")),
        iceland: this.graph.addNode(new Territory("iceland", "europe")),
        moscow: this.graph.addNode(new Territory("moscow", "europe")),
        sweden: this.graph.addNode(new Territory("sweden", "europe")),

        australia: this.graph.addNode(new Territory("australia", "oceania")),
        sumatra: this.graph.addNode(new Territory("sumatra", "oceania")),
        borneo: this.graph.addNode(new Territory("borneo", "oceania")),
        new_guinea: this.graph.addNode(new Territory("n_guinea", "oceania")),

        egypt: this.graph.addNode(new Territory("egypt", "africa")),
        algeria: this.graph.addNode(new Territory("algeria", "africa")),
        sudan: this.graph.addNode(new Territory("sudan", "africa")),
        congo: this.graph.addNode(new Territory("congo", "africa")),
        s_africa: this.graph.addNode(new Territory("s_africa", "africa")),
        madagascar: this.graph.addNode(new Territory("madagascar", "africa")),

        poland: this.graph.addNode(new Territory("poland", "asia")),
        aral: this.graph.addNode(new Territory("aral", "asia")),
        india: this.graph.addNode(new Territory("india", "asia")),
        ornsk: this.graph.addNode(new Territory("ornsk", "asia")),
        middle_east: this.graph.addNode(new Territory("middle_east", "asia")),
        vietnam: this.graph.addNode(new Territory("vietnam", "asia")),
        china: this.graph.addNode(new Territory("china", "asia")),
        mongolia: this.graph.addNode(new Territory("mongolia", "asia")),
        dudinka: this.graph.addNode(new Territory("dudinka", "asia")),
        tchita: this.graph.addNode(new Territory("tchita", "asia")),
        siberia: this.graph.addNode(new Territory("siberia", "asia")),
        vladvostok: this.graph.addNode(new Territory("vladvostok", "asia")),
        japan: this.graph.addNode(new Territory("japan", "asia"))
    }

    private registerGraphEdges() {
        /*
            North America
        */
        this.territories.alaska.addAdjacentNode("land", this.territories.mackenzie, this.territories.vancouver);
        this.territories.alaska.addAdjacentNode("sea", this.territories.vladvostok);

        this.territories.mackenzie.addAdjacentNode("land", this.territories.alaska, this.territories.vancouver, this.territories.ottawa);
        this.territories.mackenzie.addAdjacentNode("sea", this.territories.greenland);

        this.territories.vancouver.addAdjacentNode("land", this.territories.alaska, this.territories.mackenzie, this.territories.ottawa, this.territories.california);

        this.territories.ottawa.addAdjacentNode("land", this.territories.mackenzie, this.territories.mackenzie, this.territories.vancouver, this.territories.california, this.territories.new_york, this.territories.labrador);

        this.territories.california.addAdjacentNode("land", this.territories.vancouver, this.territories.ottawa, this.territories.new_york, this.territories.mexico);
        
        this.territories.new_york.addAdjacentNode("land", this.territories.labrador, this.territories.ottawa, this.territories.california, this.territories.mexico);
        this.territories.new_york.addAdjacentNode("sea", this.territories.cuba);

        this.territories.labrador.addAdjacentNode("land", this.territories.ottawa, this.territories.new_york);
        this.territories.labrador.addAdjacentNode("sea", this.territories.greenland);

        this.territories.mexico.addAdjacentNode("land", this.territories.california, this.territories.new_york, this.territories.venezuela);
        this.territories.mexico.addAdjacentNode("sea", this.territories.cuba);

        this.territories.cuba.addAdjacentNode("sea", this.territories.new_york, this.territories.mexico, this.territories.venezuela);

        this.territories.greenland.addAdjacentNode("sea", this.territories.mackenzie, this.territories.labrador, this.territories.iceland);

        /*
            South America
        */
        this.territories.venezuela.addAdjacentNode("land", this.territories.mexico, this.territories.brazil, this.territories.chile);
        this.territories.venezuela.addAdjacentNode("sea", this.territories.cuba);

        this.territories.chile.addAdjacentNode("land", this.territories.venezuela, this.territories.brazil, this.territories.argentina);

        this.territories.brazil.addAdjacentNode("land", this.territories.venezuela, this.territories.chile, this.territories.argentina);
        this.territories.brazil.addAdjacentNode("sea", this.territories.algeria);

        this.territories.argentina.addAdjacentNode("land", this.territories.chile, this.territories.brazil);

        /*
            Europe
        */
        this.territories.iceland.addAdjacentNode("sea", this.territories.greenland, this.territories.england);

        this.territories.england.addAdjacentNode("sea", this.territories.iceland, this.territories.sweden, this.territories.germany, this.territories.france);

        this.territories.france.addAdjacentNode("land", this.territories.germany, this.territories.poland);
        this.territories.france.addAdjacentNode("sea", this.territories.england, this.territories.algeria);

        this.territories.germany.addAdjacentNode("land", this.territories.france, this.territories.poland);
        this.territories.germany.addAdjacentNode("sea", this.territories.england, this.territories.sweden);
        
        this.territories.poland.addAdjacentNode("land", this.territories.france, this.territories.germany, this.territories.moscow, this.territories.middle_east);
        this.territories.poland.addAdjacentNode("sea", this.territories.sweden);

        this.territories.moscow.addAdjacentNode("land", this.territories.sweden, this.territories.poland, this.territories.middle_east, this.territories.aral, this.territories.ornsk);

        this.territories.sweden.addAdjacentNode("land", this.territories.moscow);
        this.territories.sweden.addAdjacentNode("sea", this.territories.england, this.territories.germany, this.territories.poland);

        /*
            Africa
        */
        this.territories.algeria.addAdjacentNode("land", this.territories.egypt, this.territories.sudan, this.territories.congo);
        this.territories.algeria.addAdjacentNode("sea", this.territories.brazil, this.territories.france);

        this.territories.s_africa.addAdjacentNode("land", this.territories.congo, this.territories.sudan);
        this.territories.s_africa.addAdjacentNode("sea", this.territories.madagascar);
        
        this.territories.congo.addAdjacentNode("land", this.territories.algeria, this.territories.sudan, this.territories.s_africa);
        
        this.territories.sudan.addAdjacentNode("land", this.territories.egypt, this.territories.algeria, this.territories.s_africa, this.territories.congo);
        this.territories.sudan.addAdjacentNode("sea", this.territories.madagascar);
        
        this.territories.madagascar.addAdjacentNode("sea", this.territories.s_africa, this.territories.sudan);
        
        this.territories.egypt.addAdjacentNode("land", this.territories.algeria, this.territories.sudan, this.territories.middle_east);

        /*
            Oceania
        */
        this.territories.australia.addAdjacentNode("sea", this.territories.sumatra, this.territories.borneo, this.territories.new_guinea);

        this.territories.sumatra.addAdjacentNode("sea", this.territories.australia, this.territories.borneo, this.territories.india, this.territories.vietnam);
        
        this.territories.borneo.addAdjacentNode("sea", this.territories.australia, this.territories.sumatra, this.territories.new_guinea, this.territories.vietnam);
        
        this.territories.new_guinea.addAdjacentNode("sea", this.territories.australia, this.territories.borneo);

        /*
            Asia
        */
        this.territories.middle_east.addAdjacentNode("land", this.territories.egypt, this.territories.poland, this.territories.moscow, this.territories.aral, this.territories.india);

        this.territories.ornsk.addAdjacentNode("land", this.territories.dudinka, this.territories.mongolia, this.territories.china, this.territories.aral, this.territories.moscow);
        
        this.territories.aral.addAdjacentNode("land", this.territories.ornsk, this.territories.moscow, this.territories.middle_east, this.territories.india, this.territories.china);
        
        this.territories.india.addAdjacentNode("land", this.territories.middle_east, this.territories.aral, this.territories.china, this.territories.vietnam);
        this.territories.india.addAdjacentNode("sea", this.territories.sumatra);
        
        this.territories.dudinka.addAdjacentNode("land", this.territories.ornsk, this.territories.mongolia, this.territories.tchita, this.territories.siberia);
        
        this.territories.mongolia.addAdjacentNode("land", this.territories.dudinka, this.territories.ornsk, this.territories.china, this.territories.tchita);
        
        this.territories.china.addAdjacentNode("land", this.territories.mongolia, this.territories.ornsk, this.territories.aral, this.territories.india, this.territories.vietnam, this.territories.vladvostok, this.territories.tchita);
        this.territories.china.addAdjacentNode("sea", this.territories.japan);
        
        this.territories.tchita.addAdjacentNode("land", this.territories.siberia, this.territories.dudinka, this.territories.mongolia, this.territories.china, this.territories.vladvostok);
        
        this.territories.siberia.addAdjacentNode("land", this.territories.dudinka, this.territories.tchita, this.territories.vladvostok);
        
        this.territories.vietnam.addAdjacentNode("land", this.territories.india, this.territories.china);
        this.territories.vietnam.addAdjacentNode("sea", this.territories.sumatra, this.territories.borneo);
        
        this.territories.vladvostok.addAdjacentNode("land", this.territories.siberia, this.territories.tchita, this.territories.china);
        this.territories.vladvostok.addAdjacentNode("sea", this.territories.japan, this.territories.alaska);
        
        this.territories.japan.addAdjacentNode("sea", this.territories.china, this.territories.vladvostok);
            
    }

    private validateGraph() {
        // assert bidirectional edges
        for (const n of Array.from(this.graph.nodes.values())) {
            // by land
            for (const an of Array.from(n.landAdjacentNodes)) {
                if (!an.landAdjacentNodes.has(n)) {
                    svlog.err(`While validating Territory Graph: Node "${an.data.code}" is missing bidirectional connection to node "${n.data.code}" via "land"`);
                }
            }
            // by sea
            for (const an of Array.from(n.seaAdjacentNodes)) {
                if (!an.seaAdjacentNodes.has(n)) {
                    svlog.err(`While validating Territory Graph: Node "${an.data.code}" is missing bidirectional connection to node "${n.data.code}" via "sea"`);
                }
            }
        }
        
    }

    constructor() {
        this.registerGraphEdges();
        this.validateGraph();
    }

    get asGraphTerritoryPacket(): GraphTerritoryPacket {
        return {
            territories: Array.from(this.graph.nodes.values()).map(n => <GraphNodeTerritoryPacket>{
                code: n.data.code,
                continent: n.data.continentCode,
                land_adjacent_territories: Array.from(n.landAdjacentNodes).map(a => a.data.code),
                sea_adjacent_territories: Array.from(n.seaAdjacentNodes).map(a => a.data.code)
            })
        }
    }


}