const css = require('../css/style.css').toString();

export class Style {
    constructor() {
        console.log(css);
    }

    teste(a: number) {
        console.log(a);
    }
}

export default Style;