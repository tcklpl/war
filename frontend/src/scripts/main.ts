import { Game } from "./game";

var game!: Game;
var resizeTimeout: number = -1;

function main() {
    game = new Game($("#game-canvas"));
}

$(window).on("resize", () => {
    if (resizeTimeout != -1)
        clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        game.getEngine().adjustToWindowSize()
        resizeTimeout = -1;
    }, 500);
});

main();
