uniform sampler2D uHeightmapTexture;

uniform float uDepthFactor;
uniform float uInvertHeightmap;
uniform vec2 uHeightmapScaling;

float sampleHeightmap(vec2 position) {
    position.y = 1.0 - position.y;
    position = 0.5 + (position - 0.5) * uHeightmapScaling;

    float value = texture2D(uHeightmapTexture, position).r;
    value = mix(value, 1.0 - value, uInvertHeightmap);

    float isInBounds = step(0.0, position.x) * step(position.x, 1.0) * step(0.0, position.y) * step(position.y, 1.0);
    
    return mix(0.0, uDepthFactor * value, isInBounds);
}
