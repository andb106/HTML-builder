const fs = require('fs');
const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const readline = require('readline/promises');
const path = require('path');

async function makeDistFolder (folderName) {
  await rm(path.join(__dirname, folderName), {recursive: true, force: true});
  await mkdir(path.join(__dirname, folderName), {recursive: true});
}

async function getComponentContent(componentName) {
  let content = '';
  const pathToComponent = path.join(__dirname, '/components', componentName + '.html');
  const rs = fs.createReadStream(pathToComponent);
  for await (const chunk of rs) {
    content += chunk.toString();
  }
  return content;
}

async function makeIndexFile(folderName) {
  const fileReadStream = fs.createReadStream(path.join(__dirname, 'template.html'));
  const fileWriteStream = fs.createWriteStream(path.join(__dirname, folderName,'index.html'));
  const rl = readline.createInterface({
    input: fileReadStream,
  });

  for await (const line of rl) {
    let newLine = line;
    if (line.includes('{{')) {
      const componentName = line.match(/{{(.*?)}}/)[1];
      const componentContent = await getComponentContent(componentName);
      newLine = line.replace(/{{.*?}}/, componentContent);
    }
    fileWriteStream.write(newLine + '\n');
  }
}


async function bundleCss (pathToSomeFolder, pathToOutput) {
  const ws = fs.createWriteStream(pathToOutput);
  try {
    const files = await readdir(pathToSomeFolder, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const pathToFile = path.join(pathToSomeFolder, file.name);
        const rs = fs.createReadStream(pathToFile, 'utf-8');
        rs.on('data', (data) => ws.write(data));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(pathSrc, pathDest) {
  await rm(pathDest, {recursive: true, force: true});
  await mkdir(pathDest, {recursive: true});

  const items = await readdir(pathSrc, {withFileTypes: true});
  for (let item of items) {
    const itemSrcPath = path.join(pathSrc, item.name);
    const itemDestPath = path.join(pathDest, item.name);
    if (item.isDirectory()) {
      await copyDir(itemSrcPath, itemDestPath);
    } else {
      await copyFile(itemSrcPath, itemDestPath);
    }
  }
}

async function buildProject(folderName) {
  await makeDistFolder(folderName);
  await makeIndexFile(folderName);
  await bundleCss(path.join(__dirname, '/styles'), path.join(__dirname, folderName, 'style.css'));
  await copyDir(path.join(__dirname, '/assets'), path.join(__dirname, folderName, '/assets'));
}

buildProject('/project-dist');

