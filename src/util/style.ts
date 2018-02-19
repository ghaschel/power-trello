const css = require('../css/style.css').toString();

namespace Style {
    export function applyStyles():any {
        let style = document.createElement("style");
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
}

export default Style;