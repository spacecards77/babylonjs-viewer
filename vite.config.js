import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
    return {
        base: command === 'build' ? '/babylonjs-viewer/' : './',
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs'
            }
        }
    };
});
