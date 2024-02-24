const image_elements = document.querySelectorAll('img');
for (const image_element of image_elements) {
    // Remove srcs from image with width less than 1600px
    let srcset = image_element.getAttribute('srcset');
    if (!srcset) {
        continue;
    }
    let srcs = srcset.split(', ').map(src => src.split(' '));
    let new_srcs = srcs.filter(src => parseInt(src[1]) >= 1600);
    let new_srcset = new_srcs.map(src => src.join(' ')).join(', ');
    image_element.setAttribute('srcset', new_srcset);
}