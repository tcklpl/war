
export class ShaderUtils {

    /**
     * Creates a shader with the source.
     * @param gl the WebGL rendering context
     * @param type the type of the shader wished: gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @param source the shaders source
     * @returns the created shader
     */
    static createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type);
        if (!shader) throw `Failed to create shader: ${source}`;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success)
            return shader;

        let error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw `Failed to compile shader: \n\n${source}\n\n${error}`;
    }

    /**
     * Creates a shader program with the vertex and fragment shaders provided.
     * @param gl the WebGL rendering context
     * @param vertexShader the source for the vertex shader
     * @param fragmentShader the source for the fragment shader
     * @returns the created program
     */
    static createProgram(gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram {
        const program = gl.createProgram();
        if (!program) throw `Failed to create shader program with shaders: ${vertexShader} and ${fragmentShader}`;

        gl.attachShader(program, this.createShader(gl, gl.VERTEX_SHADER, vertexShader));
        gl.attachShader(program, this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success)
            return program;

        gl.deleteProgram(program);
        throw `Failed to link shader program with shaders: \n\n${vertexShader}\n\n and \n\n${fragmentShader}\n\nError: ${gl.getError()}`
    }

}