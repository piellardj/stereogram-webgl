precision mediump float;

uniform sampler2D uHeightmapTexture;

varying vec2 vPosition;

void main(void) {
    float value = texture2D(uHeightmapTexture, vPosition).r;
    vec3 color = vec3(value);
    gl_FragColor = vec4(color, 1);
}
