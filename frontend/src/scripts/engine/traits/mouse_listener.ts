
export interface IMouseListener {

    onMouseMove?(mouseX: number, mouseY: number): void;
    onMouseLeftClick?(): void;
    onMouseRightClick?(): void;
    onMouseScroll?(deltaY: number): void;
    onMouseScrollStop?(): void;


}