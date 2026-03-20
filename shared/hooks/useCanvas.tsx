import { useEffect, useRef } from 'react';

export type InitFunction = (
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
) => void;

export type DrawFunction = (
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    frameCount: number
) => void;

type UseCanvasOptions = {
    onDraw: DrawFunction;
    onInit?: InitFunction;
    width?: number;
    height?: number;
    contextAttributes?: WebGLContextAttributes;
    scaleToDisplay?: boolean;
};

export function useCanvas({
    onDraw,
    onInit,
    width,
    height,
    contextAttributes,
    scaleToDisplay = false,
}: UseCanvasOptions) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(null);
    const contextRef = useRef<WebGLRenderingContext | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setCanvasSize = () => {
            let w: number, h: number;

            if (width !== undefined && height !== undefined) {
                w = width;
                h = height;
            } else {
                w = canvas.clientWidth;
                h = canvas.clientHeight;
            }

            if (scaleToDisplay) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
            } else {
                canvas.width = w;
                canvas.height = h;
                canvas.style.width = '';
                canvas.style.height = '';
            }

            if (!contextRef.current) {
                const gl = canvas.getContext('webgl', contextAttributes);
                if (!gl) {
                    console.error('WebGL not supported');
                    return;
                }
                contextRef.current = gl;
            }

            contextRef.current?.viewport(0, 0, canvas.width, canvas.height);
        };

        setCanvasSize();

        if (width === undefined || height === undefined) {
            const observer = new ResizeObserver(setCanvasSize);
            observer.observe(canvas);
            return () => observer.disconnect();

        } else if (scaleToDisplay) {
            window.addEventListener('resize', setCanvasSize);
            return () => window.removeEventListener('resize', setCanvasSize);
        }
    }, [width, height, scaleToDisplay, contextAttributes]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = contextRef.current;
        if (!canvas || !gl) return;

        onInit?.(gl, canvas);

        let frameCount = 0;
        let active = true;

        const draw = () => {
            if (!active) return;
            onDraw(gl, canvas, frameCount);
            frameCount++;
            requestRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            active = false;
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
        };
    }, [onDraw, onInit]);

    return canvasRef;
}

const createShader = (gl: WebGLRenderingContext, shaderType: GLenum, source: string) => {
    const shader = gl.createShader(shaderType);
    if (!shader) {
        console.error("Ошибка создания шейдера!");
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Ошибка компиляции шейдера!", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export const createProgram = (gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) => {
    const program = gl.createProgram();

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    if (!vertexShader) return null;

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!fragmentShader) {
        gl.deleteShader(vertexShader);
        return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Ошибка линковки программы:", gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}