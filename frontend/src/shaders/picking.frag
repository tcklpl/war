#version 300 es

precision highp float;

uniform vec4 u_id;

out vec4 outColor;

void main() {
    outColor = u_id;
}