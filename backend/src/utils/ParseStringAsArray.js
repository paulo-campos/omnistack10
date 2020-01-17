module.exports = function pasrStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim());
}