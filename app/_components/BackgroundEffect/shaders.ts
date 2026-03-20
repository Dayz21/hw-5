export const vertexShaderSource = `
attribute vec2 a_position;
attribute float a_alpha;

varying float v_alpha;

void main() {
    v_alpha = a_alpha;
    gl_Position = vec4(a_position, 0.0, 1.0);
    
    gl_PointSize = 4.0; // размер точки
}
`;

export const fragmentShaderSource = `
precision mediump float;

uniform vec3 u_color;
varying float v_alpha;

void main() {
    // для точек делаем круг
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    float alpha = v_alpha;

    // если рисуем точку — делаем её круглой
    if (dist > 0.5) discard;

    gl_FragColor = vec4(u_color * v_alpha, v_alpha);
}
`;