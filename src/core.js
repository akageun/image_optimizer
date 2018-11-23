const utils = require('./utils');
const fs = require('fs');
const p = require('path');
const im = require('imagemagick');

function imageResize(item, item2) {
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

function result(rtnFiles) {
    let tmpHtmlFile = fs.readFileSync('resultHtml.html', 'utf8');

    let tmpHtmlTxt = [];

    tmpHtmlTxt.push("<table class='table'>");
    for (let rtnFilesKey in rtnFiles) {

        const tmp = rtnFiles[rtnFilesKey];

        const statsOri = fs.statSync(p.join(tmp.ori));
        const statsChg = fs.statSync(p.join(tmp.chg));

        tmpHtmlTxt.push("<tr>");
        tmpHtmlTxt.push("<td>" + tmp.ori + "</td>");
        tmpHtmlTxt.push("<td>" + statsOri.size + "</td>");
        tmpHtmlTxt.push("<td>" + statsChg.size + "</td>");
        tmpHtmlTxt.push("<td>" + utils.bytesToSize(statsOri.size - statsChg.size) + "</td>");
        tmpHtmlTxt.push("</tr>");
    }
    tmpHtmlTxt.push("</table>");

    fs.writeFile('tmp_html_2.html', utils.replaceAll(tmpHtmlFile, '##FILE_BODY##', tmpHtmlTxt.join('')), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

module.exports = {
    /**
     * 이미지 가져오기
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async GET_IMAGE_LIST(config) {
        let rtnFiles = [];

        if (fs.existsSync(config.convertSavePath)) {
            console.log("Already Folder");
            return;

        } else {
            fs.mkdirSync(config.convertSavePath);
        }

        const files = utils.readAllInDir(config.targetFolder, config.includeFileEx);

        for (let filesKey in files) {
            const itemJson = files[filesKey];

            const item = p.join(itemJson.path, itemJson.fileName);
            const item2 = p.join(itemJson.path, config.convertSavePath, itemJson.fileName);

            const stats = fs.statSync(item);

            if (stats.size > config.convertMinSize) {
                const item22 = await imageResize(item, item2);
                rtnFiles.push({ori: item, chg: item22});
            } else {
                rtnFiles.push({ori: item, chg: item});
            }

        }

        await result(rtnFiles);
    }
}
