
export class IdentifierPool {

    private _currentID: number = 0;

    requestID() {
        return this._currentID++;
    }

}