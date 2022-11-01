const { readdir, stat } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, '/secret-folder');

async function funcReadDir(pathToSomeFolder) {
  try {
    const files = await readdir(pathToSomeFolder, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const tmpPath = path.join(pathToSomeFolder, file.name);
        const fileStats = await stat(tmpPath);
        console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).slice(1)} - ${fileStats.size}b`);
      }
    };
  } catch (err) {
    console.error(err);
  }
}

funcReadDir(pathToFolder);



