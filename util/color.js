const convert = require('color-convert');

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(rgb_array) {
    return "#" + componentToHex(rgb_array[0]) + componentToHex(rgb_array[1]) + componentToHex(rgb_array[2]);
}

function getHtmlStyleFromHex(hex){

    let color = convert.hex.keyword(hex)
}

module.exports = {rgbToHex}
