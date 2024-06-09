
export type ContinentCode = "n_america" | "s_america" | "europe" | "oceania" | "africa" | "asia";
export type TerritoryCode = "alaska" | "california" | "cuba" | "greenland" | "labrador" | "mackenzie" | "mexico" | "new_york" | "ottawa" | "vancouver" | "argentina" | "brazil" | "chile" | "venezuela" | "germany" | "france" | "england" | "iceland" | "moscow" | "sweden" | "australia" | "sumatra" | "borneo" | "n_guinea" | "egypt" | "algeria" | "sudan" | "congo" | "s_africa" | "madagascar" | "poland" | "aral" | "india" | "ornsk" | "middle_east" | "vietnam" | "china" | "mongolia" | "dudinka" | "tchita" | "siberia" | "vladvostok" | "japan";

export interface GraphNodeTerritoryPacket {
    code: TerritoryCode;
    continent: ContinentCode;

    land_adjacent_territories: TerritoryCode[];
    sea_adjacent_territories: TerritoryCode[];
}

export interface GraphTerritoryPacket {
    territories: GraphNodeTerritoryPacket[];
}