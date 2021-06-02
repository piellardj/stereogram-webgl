precision mediump float;

uniform sampler2D uHeightmapTexture;
uniform float uInvertHeightmap;

varying vec2 vPosition;

void main(void) {
    float value = texture2D(uHeightmapTexture, vPosition).r;
    value = mix(value, 1.0 - value, uInvertHeightmap);

    vec3 color = vec3(value);
    gl_FragColor = vec4(color, 1);
}
