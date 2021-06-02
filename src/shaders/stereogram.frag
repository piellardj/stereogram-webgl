precision mediump float;

uniform sampler2D uTileTexture;
uniform sampler2D uHeightmapTexture;

uniform float uTileColor;
uniform float uTileHeight;
uniform float uShowUV;
uniform float uDepthFactor;

varying vec2 vPosition;

float heightmap(const vec2 position) {
    return uDepthFactor * (1.0 - texture2D(uHeightmapTexture, position * vec2(1, -1) + vec2(0, 1)).r);
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
    position.y = fract(uTileHeight * position.y);
    return position;
}

void main(void) {
    vec2 position = originalPosition(vPosition);

    vec4 colorUV = vec4(position, 0, 1);

    vec4 tileSample = texture2D(uTileTexture, position);
    vec4 color = mix(vec4(vec3(tileSample.r), 1), tileSample, uTileColor);
    gl_FragColor = mix(color, colorUV, uShowUV);
}
