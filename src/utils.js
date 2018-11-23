const fs = require('fs');
const p = require('path');
const minimatch = require('minimatch');

function toMatcherFunction(ignoreEntry) {
    if (typeof ignoreEntry == 'function') {
        return ignoreEntry
    }

    return patternMatcher(ignoreEntry)
}

function patternMatcher(pattern) {
    return function (path, stats) {
        var minimatcher = new minimatch.Minimatch(pattern, {matchBase: true})
        return (!minimatcher.negate || stats.isFile()) && minimatcher.match(path)
    }
}

function privateRead(path, include) {
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
            const tmp = privateRead(filePath, include);

            list = list.concat(tmp);
        } else {
            list.push({path: path, fileName: file})
        }
    });

    return list;
}

module.exports = {
    replaceAll(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    },
    bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return '0 Byte';
        }

        const num = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, num), 2) + ' ' + sizes[num];
    },
    readAllInDir(path, include) {
        return privateRead(path, include);
    }
}
