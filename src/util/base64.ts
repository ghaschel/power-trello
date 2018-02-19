const types = require('node-sass').types;
const fileSystem = require('fs');
const path = require('path');
const mime = require('mime-types');
let cachedPromises: any = {};

namespace Base64 {
    export function getFunctions():any {
        return {
            'data-url($filePath)': (filePath: any, done: any) => {
                fileToDataURI(filePath).then((uri: any) => {
                    done(new types.String(`url(${uri})`));
                });
            }
        }
    }

    function loadFile(filePath: string): any {
        if (cachedPromises[filePath]) {
            return cachedPromises[filePath];
        }
        let promise = Promise.resolve(path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath));
    
        return cachedPromises[filePath] = new Promise((resolve, reject) => {
            promise.then((absolutePath: string) => {
                let normalizedPath = path.normalize(absolutePath).replace(/^file\:|\!.*$/g, '');

                fileSystem.readFile(normalizedPath, (error: any, content: any) => {
                    error ? reject(error) : resolve({content, normalizedPath});
                })
            });
        });
    }

    function fileToDataURI(filePath: any): any {
        filePath = filePath && filePath.getValue() || filePath;

        return loadFile(filePath).then((file: any) => {
            let mimeType = mime.lookup(file.normalizedPath);
            let base64 = file.content.toString('base64');

            return `"data:${mimeType};base64,${base64}"`;
        }, (error: any) => {
            console.error(error.toString());
        });
    }
}

export default Base64;