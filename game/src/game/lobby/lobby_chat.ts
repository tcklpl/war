import { Listener } from "typeUtils";
import { ClientPacketSendChatMessage } from "../server/connection/packet/to_send/lobby/common/send_chat_message";

export type LobbyChatMessage = { sender: string, msg: string }; 

export class LobbyChat {

    private _messages: LobbyChatMessage[] = [];
    private _listeners: Listener<LobbyChatMessage[]>[] = [];

    sendMessage(msg: string) {
        new ClientPacketSendChatMessage(msg).dispatch();
    }

    registerNewMessage(msg: LobbyChatMessage) {
        this._messages.push(msg);
        this.triggerListeners();
    }

    eraseHistory() {
        this._messages = [];
        this.triggerListeners();
    }

    private triggerListeners() {
        this._listeners.forEach(l => l(this._messages));
    }

    onUpdate(listener: Listener<LobbyChatMessage[]>) {
        this._listeners.push(listener);
    }

    get messages() {
        return this._messages;
    }

}