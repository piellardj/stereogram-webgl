precision mediump float;

uniform sampler2D uTexture;

varying vec2 vPosition;

void main(void) {
    vec2 uv = vec2(vPosition.x, 1.0 - vPosition.y);
    vec4 sample = texture2D(uTexture, uv);
    if (sample.a < 0.5) {
        discard;
    }
    sample.a = 1.0;
    gl_FragColor = sample;
}
