export const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
        resolve(image)
    };
    image.onerror = (error) => {
        console.error(`Can't load ${src}`)
        reject(error)
    }

    image.src = src;
})
