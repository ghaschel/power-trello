const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

let cachedPromises = {};
let loadFile, fileToDataURI;

loadFile = (filePath) => {
    if (cachedPromises[filePath]) {
        return cachedPromises[filePath];
    }
    let promise = Promise.resolve(path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath));

    return cachedPromises[filePath] = new Promise((resolve, reject) => {
        promise.then(absolutePath => {
            let normalizedPath = path.normalize(absolutePath).replace(/^file\:|\!.*$/g, '');

            fs.readFile(normalizedPath, (error, content) => {
                error ? reject(error) : resolve({content, normalizedPath});
            })
        });
    });
}

fileToDataURI = (filePath) => {
    filePath = filePath && filePath.getValue() || filePath;

    return loadFile(filePath).then((file) => {
        let mimeType = mime.lookup(file.normalizedPath);
        let base64 = file.content.toString('base64');

        return `"data:${mimeType};base64,${base64}"`;
    }, error => {
        console.error(error.toString());
    });
}

module.exports = {
    'data-url($filePath)': (filePath, done) => {
        fileToDataURI(filePath).then((uri) => {
            done(new sass.types.String(`url(${uri})`));
        });
    }
};
