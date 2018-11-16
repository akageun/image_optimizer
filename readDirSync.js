const fs = require('fs'),
    p = require('path'),
    minimatch = require('minimatch');

function patternMatcher(pattern) {
    return function (path, stats) {
        var minimatcher = new minimatch.Minimatch(pattern, {matchBase: true})
        return (!minimatcher.negate || stats.isFile()) && minimatcher.match(path)
    }
}

function toMatcherFunction(ignoreEntry) {
    if (typeof ignoreEntry == 'function') {
        return ignoreEntry
    }

    return patternMatcher(ignoreEntry)
}

function readdir(path, include) {
    include = include || [];
    include = include.map(toMatcherFunction);

    let list = [];

    const files = fs.readdirSync(path);

    if (files.length === false) {
        return list;
    }

    files.forEach(function (file) {
        const filePath = p.join(path, file)
        const stats = fs.statSync(filePath);

        if (stats.isDirectory() === false && include.some(function (matcher) {
            return matcher(filePath, stats)
        }) === false) {
            return;
        }

        if (stats.isDirectory()) {
            list = list.concat(readdir(filePath, include));
        } else {
            list.push({path: path, fileName: file})
        }
    });

    return list;
}

module.exports = readdir
