precision mediump float;

uniform sampler2D uTileTexture;

uniform float uTileColor;
uniform float uTileHeight;
uniform vec2 uTileScaling;
uniform float uShowUV;

varying vec2 vPosition;uniform sampler2D uHeightmapTexture;

uniform float uDepthFactor;
uniform float uInvertHeightmap;
uniform vec2 uHeightmapScaling;

float sampleHeightmap(vec2 position) {
    position.y = 1.0 - position.y;
    position = 0.5 + (position - 0.5) * uHeightmapScaling;

    vec4 sample = texture2D(uHeightmapTexture, position);
    float value = dot(vec3(1.0 / 3.0), sample.rgb);
    value = mix(value, 1.0 - value, uInvertHeightmap);

    float isInBounds = step(0.0, position.x) * step(position.x, 1.0) * step(0.0, position.y) * step(position.y, 1.0);
    
    return mix(0.0, uDepthFactor * value, isInBounds);
}

vec2 originalPosition(vec2 position) {
    const float stripesCount = #INJECT(STRIPES_COUNT);
    const int loopSize = #INJECT(LOOP_SIZE);

    position.x *= stripesCount + 1.0;
    for(int i = 0; i < loopSize; i++) {
        if(position.x >= 1.0) {
            vec2 previousPosition = vec2((position.x - 1.0) / stripesCount, position.y);
            position.x -= 1.0 - sampleHeightmap(previousPosition) * 0.45;
        }
    }
    position.y = fract(position.y / uTileHeight);
    return position;
}

vec4 sampleTile(vec2 coords) {
    coords = 0.5 + (coords - 0.5) * uTileScaling * vec2(1,-1);
    return texture2D(uTileTexture, coords);
}

void main(void) {
    vec2 position = originalPosition(vPosition);

    vec4 tileSample = sampleTile(position);
    vec4 monocolorTile = vec4(vec3(tileSample.r), 1);

    vec4 color = mix(monocolorTile, tileSample, uTileColor);

    vec4 colorUV = vec4(position, 0, 1);
    gl_FragColor = mix(color, colorUV, uShowUV);
}
