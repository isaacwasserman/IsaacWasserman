'use strict';

function createGlShader(gl, type, glsl) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, glsl);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return;
    }
    return shader;
}

async function render_noise(selector, color, density, alpha, complexity) {
    let base_frag = await fetch('noise2D.glsl');
    base_frag = await base_frag.text();

    let frag = `
        precision highp float;  // medium sufficient on desktop, high needed on mobile
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 per;
        uniform float complexity;
        uniform float density;
        uniform float alpha;
        uniform vec3 albedo;
        ${base_frag}
        float color(vec2 xy) {
            return snoise(xy);
        }
        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
            vec2 p = (fragCoord.xy/iResolution.y) * 2.0 - 1.0;
            vec3 xyz = vec3(p, 0);
            vec2 step = vec2(1.3, 1.7);
            float n = color(xyz.xy);
            n += 0.5 * color(xyz.xy * 2.0 - step);
            n += 0.25 * color(xyz.xy * 4.0 - 2.0 * step);
            n += 0.125 * color(xyz.xy * 8.0 - 3.0 * step);
            n += 0.0625 * color(xyz.xy * 16.0 - 4.0 * step);
            n += 0.03125 * color(xyz.xy * 32.0 - 5.0 * step);
            n = 0.5 + 0.5 * n;
            if (n < density) {
                fragColor = vec4(0, 0, 0, 0);
            }
            else {
                fragColor = vec4(albedo, alpha);
            }
        }
        void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
    `;

    let vert = `
        precision highp float;
        attribute vec2 a_position;
        void main () {
            gl_Position = vec4(a_position, 0, 1);
        }`;

    const canvas = document.querySelector(selector);
    const gl = canvas.getContext('webgl');
    let canvasSize = { w: canvas.clientWidth, h: canvas.clientHeight };
    canvas.width = gl.viewportWidth = canvasSize.w | 0;
    canvas.height = gl.viewportHeight = canvasSize.h | 0;

    let vertShader = createGlShader(gl, gl.VERTEX_SHADER, vert);
    let fragShader = createGlShader(gl, gl.FRAGMENT_SHADER, frag);
    let program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return;
    }

    let locations = {
        a_position: gl.getAttribLocation(program, 'a_position'),
        iTime: gl.getUniformLocation(program, 'iTime'),
        iResolution: gl.getUniformLocation(program, 'iResolution'),
        per: gl.getUniformLocation(program, 'per'),
        complexity: gl.getUniformLocation(program, 'complexity'),
        density: gl.getUniformLocation(program, 'density'),
        alpha: gl.getUniformLocation(program, 'alpha'),
        color: gl.getUniformLocation(program, 'albedo')
    };

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-4, -4, +4, -4, 0, +4]), gl.STATIC_DRAW);

    const startTime = Date.now();

    function draw() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(1, 0, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(locations.a_position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(locations.a_position);

        gl.uniform1f(locations.iTime, (Date.now() - startTime) * 1e-3);
        gl.uniform2f(locations.iResolution, gl.viewportWidth, gl.viewportHeight);
        gl.uniform2f(locations.per, 1.0, 1.0);
        gl.uniform1f(locations.complexity, complexity);
        gl.uniform1f(locations.density, density);
        gl.uniform1f(locations.alpha, alpha);
        gl.uniform3fv(locations.albedo, color);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(draw);
    }

    // Redraw loop will run forever
    draw();
}

export { render_noise };