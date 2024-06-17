import { ClientPacketSendChatMessage } from '../server/connection/packet/to_send/lobby/common/send_chat_message';

export type LobbyChatMessage = { sender: string; msg: string };

export class LobbyChat {
    private _messages: LobbyChatMessage[] = [];

    sendMessage(msg: string) {
        new ClientPacketSendChatMessage(msg).dispatch();
    }

    registerNewMessage(msg: LobbyChatMessage) {
        this._messages.push(msg);
        game.state.reactState.useGameSession.setChat([...this._messages]);
    }

    eraseHistory() {
        this._messages = [];
        game.state.reactState.useGameSession.setChat([]);
    }

    get messages() {
        return this._messages;
    }
}
