"use client";

import {
    createProgram,
    DrawFunction,
    InitFunction,
    useCanvas
} from "@/shared/hooks/useCanvas";

import { fragmentShaderSource, vertexShaderSource } from "./shaders";
import { useCallback, useRef } from "react";

type Point = {
    x: number;
    y: number;
    vx: number;
    vy: number;
};

const POINTS_COUNT = 60;
const MAX_DIST = 0.5;

function parseColor(color: string): [number, number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return [1, 1, 1, 1];

  ctx.fillStyle = color;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1  , 1);
  const pixel = ctx.getImageData(0, 0, 1, 1).data;

  return [
    pixel[0] / 255,
    pixel[1] / 255,
    pixel[2] / 255,
    pixel[3] / 255,
  ];
}

const BackgroundEffect = () => {
    const programRef = useRef<WebGLProgram>(null);

    const positionBufferRef = useRef<WebGLBuffer>(null);
    const alphaBufferRef = useRef<WebGLBuffer>(null);

    const positionLocRef = useRef<number>(0);
    const alphaLocRef = useRef<number>(0);
    const colorUniformRef = useRef<WebGLUniformLocation | null>(null);

    const pointsRef = useRef<Point[]>([]);

    const handleInit = useCallback<InitFunction>((gl) => {
        gl.clearColor(0, 0, 0, 0);

        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) return;

        programRef.current = program;

        positionLocRef.current = gl.getAttribLocation(program, "a_position");
        alphaLocRef.current = gl.getAttribLocation(program, "a_alpha");
        colorUniformRef.current = gl.getUniformLocation(program, "u_color");

        positionBufferRef.current = gl.createBuffer();
        alphaBufferRef.current = gl.createBuffer();

        pointsRef.current = new Array(POINTS_COUNT).fill(0).map(() => ({
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            vx: (Math.random() - 0.5) * 0.002,
            vy: (Math.random() - 0.5) * 0.002,
        }));

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    }, []);

    const handleDraw = useCallback<DrawFunction>((gl) => {
        gl.clear(gl.COLOR_BUFFER_BIT);

        const program = programRef.current;
        if (!program) return;

        gl.useProgram(program);

        const cssColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--line-color")
            .trim() || "#ffffff";

        const [r, g, b] = parseColor(cssColor);

        gl.uniform3f(colorUniformRef.current, r, g, b);

        const points = pointsRef.current;

        for (const p of points) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x > 1 || p.x < -1) p.vx *= -1;
            if (p.y > 1 || p.y < -1) p.vy *= -1;
        }

        const vertices: number[] = [];
        const alphas: number[] = [];

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_DIST) {
                    const alpha = Math.pow(1.0 - dist / MAX_DIST, 2.0);

                    vertices.push(points[i].x, points[i].y);
                    vertices.push(points[j].x, points[j].y);

                    alphas.push(alpha, alpha);
                }
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(positionLocRef.current);
        gl.vertexAttribPointer(positionLocRef.current, 2, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, alphaBufferRef.current);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alphas), gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(alphaLocRef.current);
        gl.vertexAttribPointer(alphaLocRef.current, 1, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, vertices.length / 2);

        const pointVertices: number[] = [];
        const pointAlphas: number[] = [];

        for (const p of points) {
            pointVertices.push(p.x, p.y);
            pointAlphas.push(1.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointVertices), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(positionLocRef.current, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, alphaBufferRef.current);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointAlphas), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(alphaLocRef.current, 1, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, pointVertices.length / 2);

    }, []);

    const canvasRef = useCanvas({
        onDraw: handleDraw,
        onInit: handleInit,
        scaleToDisplay: true,
    });

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    );
};

export default BackgroundEffect;