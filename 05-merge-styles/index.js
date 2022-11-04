const { readdir} = require('fs/promises');
const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, '/styles');
const pathToOutputFile = path.join(__dirname, '/project-dist','bundle.css');

// const pathToFolder = path.join(__dirname, '/test-files', '/styles');
// const pathToOutputFile = path.join(__dirname, '/test-files','bundle.css');

async function bundleCss (pathToSomeFolder, pathToOutput) {
  const ws = fs.createWriteStream(pathToOutput);
  try {
    const files = await readdir(pathToSomeFolder, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        console.log(file.name);
        const pathToFile = path.join(pathToSomeFolder, file.name);
        const rs = fs.createReadStream(pathToFile, 'utf-8');
        rs.on('data', (data) => ws.write(data));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

bundleCss(pathToFolder, pathToOutputFile);