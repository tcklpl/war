import { Game } from "../game";
import { Mat4 } from "./data_formats/mat/mat4";
import { MUtils } from "./data_formats/math_utils";
import { Vec4 } from "./data_formats/vec/vec4";
import { Game3DObject } from "./objects/game3d_obj";
import { ShaderProgram } from "./shader_program";

export class Renderer {

    private gl: WebGL2RenderingContext;
    private visibleObjects: Game3DObject[] = [];

    private pickingTexture!: WebGLTexture;
    private pickingDepthBuffer!: WebGLRenderbuffer;
    private pickingFrameBuffer!: WebGLFramebuffer;
    private pickingShaderProgram: ShaderProgram;
    private pickingProjectionMatrix!: Mat4;

    private fovY: number = 45;
    private near: number = 1;
    private far: number = 100;
    private perspectiveProjectionMatrix!: Mat4;

    private mouse = Game.instance.mouse;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);

        gl.clearColor(0, 0, 0, 1);

        let pickingShader = Game.instance.getEngine().shaders.getByName('picking');
        if (!pickingShader) throw `Failed to acquire the picking shader`;
        this.pickingShaderProgram = pickingShader;

        this.setupPicking();
        this.mouse.registerMouseMoveCallback((x, y) => this.setupPickingProjectionMatrix(x, y));
    }

    render() {
        Game.instance.getEngine().cameras.updateView();

        // first render into the picking framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pickingFrameBuffer);
        this.gl.viewport(0, 0, 1, 1);

        this.pickingShaderProgram.use();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.pickingShaderProgram.setUniformMat4f('u_projection', this.pickingProjectionMatrix);
        this.visibleObjects.forEach(vo => {
            this.pickingShaderProgram.setUniformVec4('u_id', vo.idVec4);
            vo.draw(this.pickingShaderProgram);
        });

        let mousePickId = this.mouse.getPixelIdOnMouse();

        // now render into the canvas
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.visibleObjects.forEach(vo => {
            vo.colorOverlay = new Vec4(0, 0, 0, 1);
        });

        if (mousePickId > 0) {
            this.visibleObjects[mousePickId - 1].colorOverlay = new Vec4(0.2, 0.2, 0.2, 1);
        }

        this.visibleObjects.forEach(vo => {
            vo.draw();
        });
    }

    addVisible(obj: Game3DObject) {
        this.visibleObjects.push(obj);
    }

    private setupPicking() {
        let tempTex = this.gl.createTexture();
        if (!tempTex) throw `Failed to create texture for the picking framebuffer`;
        this.pickingTexture = tempTex;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.pickingTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        let tempbuffer = this.gl.createRenderbuffer();
        if (!tempbuffer) throw `Failed to create picking depth buffer`;
        this.pickingDepthBuffer = tempbuffer;
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.pickingDepthBuffer);

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.pickingTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.pickingDepthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, 1, 1);

        let tempFrameBuffer = this.gl.createFramebuffer();
        if (!tempFrameBuffer) throw `Failed to create picking frame buffer`;
        this.pickingFrameBuffer = tempFrameBuffer;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pickingFrameBuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.pickingTexture, 0);
        
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.pickingDepthBuffer);
    }

    private setupPickingProjectionMatrix(mouseX: number, mouseY: number) {
        let gl = this.gl;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const top = Math.tan(MUtils.degToRad(this.fovY) * 0.5) * this.near;
        const bottom = -top;
        const left = aspect * bottom;
        const right = aspect * top;
        const width = Math.abs(right - left);
        const height = Math.abs(top - bottom);

        const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
        const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

        const subLeft = left + pixelX * width / gl.canvas.width;
        const subBottom = bottom + pixelY * height / gl.canvas.height;
        const subWidth = 1 / gl.canvas.width;
        const subHeight = 1 / gl.canvas.height;

        this.pickingProjectionMatrix = Mat4.frustum(subLeft, subLeft + subWidth, subBottom, subBottom + subHeight, this.near, this.far);
    }

    resize(width: number, height: number) {
        this.perspectiveProjectionMatrix = Mat4.perspective(MUtils.degToRad(this.fovY), width / height, this.near, this.far);
        Game.instance.getEngine().shaders.setUniformMat4OnAllPrograms('u_projection', this.perspectiveProjectionMatrix);
        this.setupPickingProjectionMatrix(this.mouse.x, this.mouse.y);
    }
}