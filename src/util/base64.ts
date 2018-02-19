const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

class Base64 {
    cachedPromises: any = {};
    'data-url($filePath)': any = (filePath: any, done: any) => {
        console.log(filePath);
        this.fileToDataURI(filePath).then((uri: any) => {
            done(new sass.types.String(`url(${uri})`));
        });
    }

    loadFile(filePath: string): any {
        if (this.cachedPromises[filePath]) {
            return this.cachedPromises[filePath];
        }
        var promise = Promise.resolve(path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath));
    
        return this.cachedPromises[filePath] = new Promise((resolve, reject) => {
            promise.then((absolutePath: string) => {
                let normalizedPath = path.normalize(absolutePath).replace(/^file\:|\!.*$/g, '');

                fs.readFile(normalizedPath, (error: any, content: any) => {
                    error ? reject(error) : resolve({content, normalizedPath});
                })
            });
        });
    }

    fileToDataURI(filePath: any): any {
        filePath = filePath && filePath.getValue() || filePath;
        return this.loadFile(filePath).then((file: any) => {
            var mimeType = mime.lookup(file.normalizedPath);
            var base64 = file.content.toString('base64');

            return `"data:${mimeType};base64,${base64}"`;
        }, (error: any) => {
            console.error(error.toString());
        });
    }
}

export default Base64;