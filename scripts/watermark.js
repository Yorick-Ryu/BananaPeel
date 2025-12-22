/**
 * Gemini Watermark Removal Utility
 * Adapted from: https://github.com/journey-ad/gemini-watermark-remover
 */

if (typeof window.WatermarkEngine === 'undefined') {
    (function (window) {
        // Constants from blendModes.js
        const ALPHA_THRESHOLD = 0.002;
        const MAX_ALPHA = 0.99;
        const LOGO_VALUE = 255;

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
                const maxChannel = Math.max(r, g, b);
                alphaMap[i] = maxChannel / 255.0;
            }
            return alphaMap;
        }

        /**
         * Remove watermark using reverse alpha blending
         */
        function removeWatermark(imageData, alphaMap, position) {
            const { x, y, width, height } = position;

            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;
                    const alphaIdx = row * width + col;
                    let alpha = alphaMap[alphaIdx];

                    if (alpha < ALPHA_THRESHOLD) continue;

                    alpha = Math.min(alpha, MAX_ALPHA);
                    const oneMinusAlpha = 1.0 - alpha;

                    for (let c = 0; c < 3; c++) {
                        const watermarked = imageData.data[imgIdx + c];
                        const original = (watermarked - alpha * LOGO_VALUE) / oneMinusAlpha;
                        imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(original)));
                    }
                }
            }
        }

        /**
         * Detect watermark configuration based on image size
         */
        function detectWatermarkConfig(imageWidth, imageHeight) {
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

            async removeWatermarkFromImage(image) {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const config = detectWatermarkConfig(canvas.width, canvas.height);
                const position = calculateWatermarkPosition(canvas.width, canvas.height, config);

                const alphaMap = await this.getAlphaMap(config.logoSize);
                removeWatermark(imageData, alphaMap, position);
                ctx.putImageData(imageData, 0, 0);
                return canvas;
            }
        }

        window.WatermarkEngine = WatermarkEngine;
    })(window);
}

