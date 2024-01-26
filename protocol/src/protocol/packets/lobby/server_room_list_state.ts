
export interface ServerRoomListState {
    max_rooms: number;
    rooms: ServerRoomListStateRoom[];
}

export interface ServerRoomListStateRoom {
    name: string;
    player_count: number;
    owner_name: string;
    joinable: boolean;
}