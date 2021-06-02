precision mediump float;

varying vec2 vPosition;

#include "_heightmap.frag"

void main(void) {
    float value = sampleHeightmap(vPosition);
    vec3 color = vec3(value);
    gl_FragColor = vec4(color, 1);
}
