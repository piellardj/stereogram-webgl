precision mediump float;

uniform sampler2D uTileTexture;
uniform sampler2D uHeightmapTexture;

uniform float uTileColor;
uniform float uTileHeight;

uniform float uDepthFactor;
uniform float uInvertHeightmap;
uniform float uShowUV;

varying vec2 vPosition;

float heightmap(const vec2 position) {
    float value = texture2D(uHeightmapTexture, vec2(position.x, 1.0 - position.y)).r;
    value = mix(value, 1.0 - value, uInvertHeightmap);
    return uDepthFactor * value;
}

vec2 originalPosition(vec2 position) {
    const float stripesCount = #INJECT(STRIPES_COUNT);
    const int loopSize = #INJECT(LOOP_SIZE);

    position.x *= stripesCount + 1.0;
    for(int i = 0; i < loopSize; i++) {
        if(position.x >= 1.0) {
            vec2 previousPosition = vec2((position.x - 1.0) / stripesCount, position.y);
            position.x -= 1.0 - heightmap(previousPosition) * 0.45;
        }
    }
    position.y = fract(position.y / uTileHeight);
    return position;
}

void main(void) {
    vec2 position = originalPosition(vPosition);

    vec4 colorUV = vec4(position, 0, 1);

    vec4 tileSample = texture2D(uTileTexture, position);
    vec4 color = mix(vec4(vec3(tileSample.r), 1), tileSample, uTileColor);
    gl_FragColor = mix(color, colorUV, uShowUV);
}
