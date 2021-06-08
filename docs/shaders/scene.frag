precision mediump float;

varying vec4 uScreenspacePosition;

void main(void) {
    float depth = 0.5 + 0.5 * uScreenspacePosition.z / uScreenspacePosition.w;
    gl_FragColor = vec4(vec3(1.0 - depth), 1);
}
