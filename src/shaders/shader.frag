precision mediump float;

uniform sampler2D uTileTexture;
uniform sampler2D uHeightmapTexture;

const int uStripesCount = 8;

varying vec2 vPosition;

float heightmap(const vec2 position) {
    return 1.0 - texture2D(uHeightmapTexture, position * vec2(1,-1) + vec2(0,1)).r;
}

vec2 originalPosition(vec2 position) {
    // position.x = fract(position.x * float(uStripesCount));
    // return position;
    // float stride = 1.0 / float(uStripesCount);

    // float cumulated = 0.0;
    position *= float(uStripesCount);
    for (int i = 0; i < uStripesCount + 2; i++) {
        if (position.x >= 1.0) {
            position.x -= 1.0 - heightmap(position / float(uStripesCount)) * 0.3;
        }
    }
    position.y = fract(position.y);
    return position;
    // return cumulated;
}

void main(void) {
    vec2 position = originalPosition(vPosition);

    vec3 color = texture2D(uTileTexture, position).rgb;
    gl_FragColor = vec4(color, 1);
}
