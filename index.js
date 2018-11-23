const core = require('./src/core');
const p = require('path');

const config = {
    convertMinSize: 1000000,
    targetFolder: 'C:\\Users\\user\\Pictures\\test',
    convertSavePath: '1234',
    includeFileEx: ["*.PNG", "*.png", "*.jpg"]

};

core.GET_IMAGE_LIST(config);
