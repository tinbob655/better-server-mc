//loads an image file, centre-crops it to a square, then clips that square to a
//circle (transparent corners) and returns the result as a new PNG File.
//PNG is required here specifically because it's the only common format that supports
//an alpha channel: JPEG/WEBP-without-alpha would just fill the corners white/black.
export function cropImageToCircle(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl: string = URL.createObjectURL(file);

        img.onload = () => {
            //use the smaller dimension so the crop only ever uses real pixels
            //from the source image, never stretches it
            const size: number = Math.min(img.width, img.height);

            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Canvas is not supported in this browser'));
                return;
            }

            //clip everything drawn from here on to a circular path,
            //so the corners of the square canvas stay transparent
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            //centre the crop: offset by however much bigger the non-square dim is
            const sx: number = (img.width - size) / 2;
            const sy: number = (img.height - size) / 2;
            ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

            canvas.toBlob(blob => {
                URL.revokeObjectURL(objectUrl);
                if (!blob) {
                    reject(new Error('Failed to encode cropped image'));
                    return;
                }
                const croppedName: string = file.name.replace(/\.[^.]+$/, '') + '.png';
                resolve(new File([blob], croppedName, {type: 'image/png'}));
            }, 'image/png');
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load the selected image'));
        };

        img.src = objectUrl;
    });
}