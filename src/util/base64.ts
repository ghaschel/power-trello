var fs = require('fs');

namespace Base64 {
    export function decode(fileName: string):string {
        console.log('teste');
        console.log(fileName);
        var bitmap = fs.readFileSync(fileName);

        return new Buffer(bitmap).toString('base64');
    }

    export function encode(base64Str: string, fileName: string): void {
        var bitmap = new Buffer(base64Str, 'base64');

        fs.writeFileSync(fileName, bitmap);
    }
}
export default Base64;