import { Game } from "../game";
import { Mat4 } from "./data_formats/mat/mat4";
import { MUtils } from "./data_formats/math_utils";
import { UInteger } from "./data_formats/uniformable_basics/u_integer";
import { Vec3 } from "./data_formats/vec/vec3";
import { Vec4 } from "./data_formats/vec/vec4";
import { OrthographicLight } from "./lights/orthographic_light";
import { Game3DObject } from "./objects/game3d_obj";
import { ShadedShaderProgram } from "./shaders/programs/shaded";
import { ShaderProgram } from "./shaders/shader_program";
import { ShadowMapAtlas } from "./shadows/shadow_atlas";
import { IMouseListener } from "./traits/mouse_listener";
import { IUniformable } from "./traits/uniformable";

export class Renderer implements IMouseListener {

    private gl: WebGL2RenderingContext;
    private visibleObjects: Game3DObject[] = [];

    private pickingTexture!: WebGLTexture;
    private pickingDepthBuffer!: WebGLRenderbuffer;
    private pickingFrameBuffer!: WebGLFramebuffer;
    private pickingProjectionMatrix!: Mat4;

    private shadowDepthTexture!: WebGLTexture;
    private shadowFramebuffer!: WebGLFramebuffer;
    private shadowShaderProgram!: ShaderProgram;
    private shadowMapSize: number = 4096;
    private solidColorShader: ShaderProgram;

    private fovY: number = 45;
    private near: number = 1;
    private far: number = 100;
    private perspectiveProjectionMatrix!: Mat4;

    private shadowAtlas = Game.instance.engine.lights.shadowAtlas;

    private mouse = Game.instance.mouse;

    //private testLight = new OrthographicLight("test", new Vec3(2, 5, 0.1), new Vec3(0.2, 0, 0.2), new Vec3(0, 1, 0), 1, 10, 70, 20);
    private testLight = new OrthographicLight({
        name: "test",
        position: new Vec3(2, 5, 0.1),
        target: new Vec3(0.2, 0, 0.2),
        up: new Vec3(0, 1, 0),
        castsShadows: true,
        enabled: true,
        near: 1,
        far: 10,
        intensity: 1,
        shadowMapResolution: 4096,
        color: new Vec3(1, 0.5, 0)
    }, 70, 20);

    //TODO: implement more solid shader programs
    private shadedShaderProgram = Game.instance.engine.shaders.getInstantiatedProgram('shaded', ShadedShaderProgram);

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);

        gl.clearColor(0, 0, 0, 1);

        let solidColor = Game.instance.engine.shaders.getByName('solid_color');
        if (!solidColor) throw `Failed to acquire the picking shader`;
        this.solidColorShader = solidColor;

        this.setupPicking();
        this.setupShadows();
        Game.instance.mouse.registerMouseListener(this);
        Game.instance.engine.lights.registerLight(this.testLight);
    }

    onMouseMove(mouseX: number, mouseY: number) {
        this.setupPickingProjectionMatrix(mouseX, mouseY);
    }

    render() {
        let activeCameraMatrix = Game.instance.engine.cameras.active?.viewMat4 as Mat4;

        // first render into the picking framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pickingFrameBuffer);
        this.gl.viewport(0, 0, 1, 1);

        this.drawScene(
            this.solidColorShader, 
            new Map([
                ['u_projection', this.pickingProjectionMatrix],
                ['u_view', activeCameraMatrix]
            ]),
            undefined,
            (o) => new Map([
                ['u_color', o.idVec4]
            ])
        );
        
        let mousePickId = this.mouse.getPixelIdOnMouse();
        Game.instance.engine.interactions.changeIdUnderMouse(mousePickId);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // now render shadows

        this.shadowAtlas.usingFramebuffer(() => {
            this.shadowAtlas.forEachEntry(e => {
                this.gl.viewport(e.position.x, e.position.y, e.size.x, e.size.y);
                this.drawScene(
                    this.solidColorShader,
                    new Map<string, IUniformable>([
                        ['u_projection', e.relativeLight.projectionMat4],
                        ['u_view', e.relativeLight.inverseWorldMat4],
                        ['u_color', new Vec4(1, 1, 1, 1)]
                    ])
                )
            });
        });

        // Game.instance.engine.lights.activeLights.forEach((l, i) => {
        //     l.usingFramebuffer(() => {
        //         this.gl.viewport(0, 0, l.info.shadowMapResolution, l.info.shadowMapResolution);

        //         this.drawScene(
        //             this.solidColorShader,
        //             new Map<string, IUniformable>([
        //                 ['u_projection', l.projectionMat4],
        //                 ['u_view', l.inverseWorldMat4],
        //                 ['u_color', new Vec4(1, 1, 1, 1)]
        //             ])
        //         );
        //     });
        // });

        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.shadowFramebuffer);
        // this.gl.viewport(0, 0, this.shadowMapSize, this.shadowMapSize);
        
        // this.drawScene(
        //     this.solidColorShader,
        //     new Map<string, IUniformable>([
        //         ['u_projection', this.testLight.projectionMat4],
        //         ['u_view', this.testLight.inverseWorldMat4],
        //         ['u_color', new Vec4(1, 1, 1, 1)]
        //     ])
        // );

        // now render using the shadows
        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // let textureMatrix = Mat4.identity();
        // textureMatrix.translate(0.5, 0.5, 0.5);
        // textureMatrix.scale(0.5, 0.5, 0.5);
        // textureMatrix.multiplyBy(this.testLight.projectionMat4);
        // textureMatrix.multiplyBy(this.testLight.inverseWorldMat4);

        this.drawScene(
            this.shadowShaderProgram,
            new Map<string, IUniformable>([
                ['u_projection', this.perspectiveProjectionMatrix],
                ['u_view', activeCameraMatrix],
                //['u_texture_matrix', textureMatrix],
                //['u_projected_texture', new Texture(this.shadowDepthTexture, 2)],
                //['u_reverse_light_direction', this.testLight.reverseDirection]
                ['u_present_lights', new UInteger(Game.instance.engine.lights.activeLights.length)]
            ]),
            () => {
                Game.instance.engine.lights.activeLights.forEach((l, i) => {
                    l.bind(this.shadowShaderProgram.lightUniforms[i]);
                });
            }
        );

    }

    private drawScene(
        shaderProgram: ShaderProgram,
        globalUniforms: Map<string, IUniformable>,
        additionalUniformSetter?: () => void,
        perObjectUniforms?: (o: Game3DObject) => Map<string, IUniformable>
        ) {

        shaderProgram.use();
        shaderProgram.setUniforms(globalUniforms);
        if (additionalUniformSetter) additionalUniformSetter();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.visibleObjects.forEach(vo => {
            if (perObjectUniforms) {
                shaderProgram.setUniforms(perObjectUniforms(vo));
            }
            vo.draw(shaderProgram);
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

    private setupShadows() {
        this.shadowShaderProgram = Game.instance.engine.shaders.getByName('shaded') as ShaderProgram;

        let tempTex = this.gl.createTexture();
        if (!tempTex) throw `Failed to create shadow map texture`;
        this.shadowDepthTexture = tempTex;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.shadowDepthTexture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,         // target
            0,                          // mip level
            this.gl.DEPTH_COMPONENT32F, // internal format
            this.shadowMapSize,         // width
            this.shadowMapSize,         // height
            0,                          // border
            this.gl.DEPTH_COMPONENT,    // format
            this.gl.FLOAT,              // type
            null                        // data
        );
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        let tempFramebuffer = this.gl.createFramebuffer();
        if (!tempFramebuffer) throw `Failed to create shadow frame buffer`;
        this.shadowFramebuffer = tempFramebuffer;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.shadowFramebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.shadowDepthTexture, 0);
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
        Game.instance.engine.shaders.setUniformMat4OnAllPrograms('u_projection', this.perspectiveProjectionMatrix);
        this.setupPickingProjectionMatrix(this.mouse.x, this.mouse.y);
    }
}