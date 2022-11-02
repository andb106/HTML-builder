const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const path = require('path');

const pathToCopyFolder = path.join(__dirname, './files-copy');
const pathToFolder = path.join(__dirname, '/files');

async function copyDir(pathSrc, pathDest) {
  await rm(pathDest, {recursive: true, force: true});
  await mkdir(pathDest, {recursive: true});

  const items = await readdir(pathSrc, {withFileTypes: true});
  for (let item of items) {
    const itemSrcPath = path.join(pathSrc, item.name);
    const itemDestPath = path.join(pathDest, item.name);
    await copyFile(itemSrcPath, itemDestPath);
  }
}

copyDir(pathToFolder, pathToCopyFolder);
