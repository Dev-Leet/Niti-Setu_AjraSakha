/* export const imageOptimization = {
  generateSrcSet(baseUrl: string, widths: number[]): string {
    return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
  },

  generateSizes(breakpoints: { viewport: string; size: string }[]): string {
    return breakpoints.map(bp => `(${bp.viewport}) ${bp.size}`).join(', ');
  },

  loadImageLazy(src: string, placeholder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  },

  compressBase64(base64: string, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = base64;
    });
  },
}; */

export const imageOptimization = {
  generateSrcSet(baseUrl: string, widths: number[]): string {
    return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
  },

  generateSizes(breakpoints: { viewport: string; size: string }[]): string {
    return breakpoints.map(bp => `(${bp.viewport}) ${bp.size}`).join(', ');
  },

  loadImageLazy(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  },

  compressBase64(base64: string, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = base64;
    });
  },
};