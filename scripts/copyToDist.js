const fse = require('fs-extra');
const path = require('path');

const source = path.resolve(__dirname, '../', 'dist');
const destination = path.resolve(__dirname, '../', 'html');

//eslint-disable-next-line
console.log("Copying html files to dist starting...");

try {
    fse.copySync(source, destination);
} catch (error) {
    console.error(error);
    process.exit(-1);
}

//eslint-disable-next-line
console.log("Copying html files to html finished!");

