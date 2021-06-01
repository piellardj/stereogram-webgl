precision mediump float;

uniform vec2 uSeed;
uniform float uColored;

varying vec2 vPosition;


// returns a random in [-0.5, 0.5]^3, centered on {0}^3
vec3 random(vec3 i) {
    // the seeds are arbitrary values that look good
    const vec3 seed1 = vec3(31.06, 19.86, 30.19);
    const vec3 seed2 = vec3(6640, 5790.4, 10798.861);

    return fract(sin(dot(i, seed1)) * seed2) - 0.5;
}

void main(void) {
    vec3 rand = random(vec3(vPosition + uSeed, uSeed.x)) + 0.5;
    vec3 color = mix(vec3(rand.x), rand, uColored);
    gl_FragColor = vec4(color, 1);
}
