/**
 * Gemini Watermark Removal Utility
 * Adapted from: https://github.com/journey-ad/gemini-watermark-remover
 * Updated to latest algorithm (v2026.03) with Noise Floor and Adaptive Gain
 */

if (typeof window.WatermarkEngine === 'undefined') {
    (function (window) {
        // Core Constants
        const ALPHA_NOISE_FLOOR = 3 / 255;  // Filter quantization noise from compressed capture
        const ALPHA_THRESHOLD = 0.002;      // Minimal activation threshold
        const MAX_ALPHA = 0.99;             // Prevent division by zero
        const LOGO_VALUE = 255;             // White logo base value

        /**
         * Calculate alpha map from background captured image
         */
        function calculateAlphaMap(bgCaptureImageData) {
            const { width, height, data } = bgCaptureImageData;
            const alphaMap = new Float32Array(width * height);

            for (let i = 0; i < alphaMap.length; i++) {
                const idx = i * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                // Take maximum channel as candidate alpha signal
                const maxChannel = Math.max(r, g, b);
                alphaMap[i] = maxChannel / 255.0;
            }
            return alphaMap;
        }

        /**
         * Remove watermark using reverse alpha blending with noise suppression
         */
        function removeWatermark(imageData, alphaMap, position, options = {}) {
            const { x, y, width, height } = position;
            const alphaGain = options.alphaGain || 1.0;

            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;
                    const alphaIdx = row * width + col;

                    const rawAlpha = alphaMap[alphaIdx];

                    // 1. Subtract noise floor to distinguish signal from quantization artifacts
                    const signalAlpha = Math.max(0, (rawAlpha - ALPHA_NOISE_FLOOR)) * alphaGain;

                    // 2. Performance optimization: Skip non-watermarked areas
                    if (signalAlpha < ALPHA_THRESHOLD) continue;

                    // 3. Use rawAlpha for inverse calculation for mathematical precision
                    // while protecting against near-opaque pixels
                    const alpha = Math.min(rawAlpha * alphaGain, MAX_ALPHA);
                    const oneMinusAlpha = 1.0 - alpha;

                    // 4. Reverse blend RGB channels: original = (watermarked - alpha * logo) / (1 - alpha)
                    for (let c = 0; c < 3; c++) {
                        const watermarked = imageData.data[imgIdx + c];
                        const original = (watermarked - alpha * LOGO_VALUE) / oneMinusAlpha;

                        // Clamp and round with high precision
                        imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(original)));
                    }
                }
            }
        }

        /**
         * Detect watermark configuration based on image size
         */
        function detectWatermarkConfig(imageWidth, imageHeight) {
            // Updated Gemini layout detection (Standard rules)
            if (imageWidth > 1024 && imageHeight > 1024) {
                return { logoSize: 96, marginRight: 64, marginBottom: 64 };
            } else {
                return { logoSize: 48, marginRight: 32, marginBottom: 32 };
            }
        }

        /**
         * Calculate watermark position
         */
        function calculateWatermarkPosition(imageWidth, imageHeight, config) {
            const { logoSize, marginRight, marginBottom } = config;
            return {
                x: imageWidth - marginRight - logoSize,
                y: imageHeight - marginBottom - logoSize,
                width: logoSize,
                height: logoSize
            };
        }

        class WatermarkEngine {
            constructor(bgCaptures) {
                this.bgCaptures = bgCaptures;
                this.alphaMaps = {};
            }

            /**
             * Factories and Loaders
             */
            static async create(bg48Data, bg96Data) {
                const bg48 = await this.loadImage(`data:image/png;base64,${bg48Data}`);
                const bg96 = await this.loadImage(`data:image/png;base64,${bg96Data}`);
                return new WatermarkEngine({ bg48, bg96 });
            }

            static loadImage(src) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            }

            async getAlphaMap(size) {
                if (this.alphaMaps[size]) return this.alphaMaps[size];

                const bgImage = size === 48 ? this.bgCaptures.bg48 : this.bgCaptures.bg96;
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(bgImage, 0, 0);
                const imageData = ctx.getImageData(0, 0, size, size);
                const alphaMap = calculateAlphaMap(imageData);
                this.alphaMaps[size] = alphaMap;
                return alphaMap;
            }

            /**
             * Main processing entry point
             */
            async removeWatermarkFromImage(image, options = {}) {
                const { alphaGain = 1.0 } = options;

                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const config = detectWatermarkConfig(canvas.width, canvas.height);
                const position = calculateWatermarkPosition(canvas.width, canvas.height, config);

                const alphaMap = await this.getAlphaMap(config.logoSize);

                // Perform the removal
                removeWatermark(imageData, alphaMap, position, { alphaGain });

                ctx.putImageData(imageData, 0, 0);
                return canvas;
            }
        }

        window.WatermarkEngine = WatermarkEngine;
    })(window);
}

