attribute vec2 aCorner;

varying vec2 vPosition;

void main(void) {
    gl_Position = vec4(aCorner, 0, 1);
    vPosition = 0.5 + 0.5 * aCorner;
}
