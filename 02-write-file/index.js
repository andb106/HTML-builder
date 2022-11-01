const { stdin, stdout} = require('process');
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'out.txt');

const myWriteStream = fs.createWriteStream(pathToFile);

stdout.write('Hello! Write some text! \n');

stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    stdout.write('Goodbye!');
    process.exit();
  }
  myWriteStream.write(chunk);
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  process.exit();
});


