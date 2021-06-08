attribute vec3 aVertice;

uniform mat4 uMVPMatrix;

varying vec4 uScreenspacePosition;

void main(void)
{
    vec4 screenspacePosition = uMVPMatrix * vec4(aVertice, 1.0);
    gl_Position = screenspacePosition;
    uScreenspacePosition = screenspacePosition;
}