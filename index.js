const readDirSync = require('./readDirSync');
const im = require('imagemagick');
const fs = require('fs');
const p = require('path');

const config = {
    convertMinSize: 1000000,
    targetFolder: '',
    includeFileEx: ["*.PNG", "*.png", "*.jpg"]

};

let rtnFiles = [];

const files = readDirSync(config.targetFolder, config.includeFileEx);

async function test() {
    for (let filesKey in files) {
        const itemJson = files[filesKey];

        const item = p.join(itemJson.path, itemJson.fileName);
        const item2 = p.join(itemJson.path, "21241", itemJson.fileName);

        const stats = fs.statSync(item);

        if (stats.size > config.convertMinSize) {
            const item22 = await foo(item, item2);
            rtnFiles.push({ori: item, chg: item22});
        } else {
            rtnFiles.push({ori: item, chg: item});
        }

    }

    await tttt();
}

function foo(item, item2) {
    return new Promise(function (resolve, reject) {
        im.convert([item, item2],
            function (err, stdout) {
                if (err) {
                    reject(err);
                }
                resolve(item2);
            });
    });
}

function tttt() {
    for (let rtnFilesKey in rtnFiles) {

        const tmp = rtnFiles[rtnFilesKey];

        const statsOri = fs.statSync(p.join(tmp.ori));
        const statsChg = fs.statSync(p.join(tmp.chg));

        console.log("rtn : ", statsOri.size, statsChg.size, bytesToSize(statsOri.size - statsChg.size) + "가 감소했습니다.");
    }
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

test();


