export const getWindowSize = (width: number, height: number) => {
    const windowWidth = width;
    const windowHeight = height;

    const offsetLeft = (window.outerWidth - windowWidth) / 2
    const offsetTop = (window.outerHeight - windowWidth) / 2
    const topHeight = (window.outerHeight - window.innerHeight) / 2
    // @ts-ignore
    const features = `left=${(window.screen.availLeft || 0) + offsetLeft},top=${offsetTop + topHeight},width=${windowWidth},height=${windowHeight - 60}`

    return features
}