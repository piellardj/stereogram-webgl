precision mediump float;

varying vec2 vPosition;uniform sampler2D uHeightmapTexture;

uniform float uDepthFactor;
uniform float uInvertHeightmap;
uniform vec2 uHeightmapScaling;

float sampleHeightmap(vec2 position) {
    position.y = 1.0 - position.y;
    position = 0.5 + (position - 0.5) * uHeightmapScaling;

    if (position.x >= 0.0 && position.x <= 1.0 && position.y >= 0.0 && position.y <= 1.0) {
        vec4 sample = texture2D(uHeightmapTexture, position);
        float value = dot(vec3(1.0 / 3.0), sample.rgb);
        value = mix(value, 1.0 - value, uInvertHeightmap);
        return uDepthFactor * value;
    } else {
        return 0.0;
    }
}

void main(void) {
    float value = sampleHeightmap(vPosition);
    vec3 color = vec3(value);
    gl_FragColor = vec4(color, 1);
}
