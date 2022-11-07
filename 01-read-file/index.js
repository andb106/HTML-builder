const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const myReadStream = fs.createReadStream(pathToFile, 'utf-8');

myReadStream.on('data', (data) => stdout.write(data));

