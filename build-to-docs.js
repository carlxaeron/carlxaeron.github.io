const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'build'); // Path of source folder. Replace 'source' with your actual source folder name.
const destinationFolder = path.join(__dirname, 'docs'); // Path of destination folder. Replace 'destination' with your actual destination folder name.

const files = fs.readdirSync(sourceFolder); // Read all files in the source folder.

files.forEach(file => { // Iterate over each file in the source folder. Replace 'file' with a variable name of your choice.  
    const sourceFilePath = path.join(sourceFolder, file); // Get the path of the source file.  
    const destinationFilePath = path.join(destinationFolder, file); // Get the path of the destination file.  
    const sourceStream = fs.createReadStream(sourceFilePath); // Create a read stream for the source file.  
    const destinationStream = fs.createWriteStream(destinationFilePath); // Create a write stream for the destination file.  
    sourceStream.pipe(destinationStream); // Pipe the source stream to the destination stream.  
    sourceStream.on('finish', () => { // Print a success message when the file is copied.  
        console.log(`File '${file}' copied successfully.`);  });  
        sourceStream.on('error', err => { // Print an error message when an error occurs.  
            console.error(`Error copying file '${file}': ${err.message}`);  });  });  
            console.log('Files copied successfully.'); // Print a success message when all files are copied.