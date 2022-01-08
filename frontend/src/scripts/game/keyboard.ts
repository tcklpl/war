
export class Keyboard {

    private keysDown: string[] = [];
    private listeners: any[] = [];

    constructor() {
        $(window).on('keydown', e => {
            if (!this.keysDown.find(a => a == e.key.toUpperCase())) {
                this.keysDown.push(e.key.toUpperCase());
                this.listeners.forEach(l => {
                    let listener = l[`onKeyDown${e.key.toUpperCase()}`];
                    if (listener)
                        listener.apply(l);
                });
            }
        });

        $(window).on('keyup', e => {
            this.keysDown.splice(this.keysDown.indexOf(e.key.toUpperCase()), 1);
            this.listeners.forEach(l => {
                let listener = l[`onKeyUp${e.key.toUpperCase()}`];
                if (listener)
                    listener.apply(l);
            });
        });
    }

    registerListener(listener: any) {
        this.listeners.push(listener);
    }

}