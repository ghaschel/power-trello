/*
The MIT License (MIT)

Copyright (c) 2017 Guilherme Haschel

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
// ==UserScript==
// @name         Power Trello
// @version      0.0.2
// @description  Pacote de melhorias para o Trello
// @author       Guilherme Haschel
// @icon         https://bytebucket.org/echo__off/power-trello/raw/master/assets/icon-48.png
// @icon64       https://bytebucket.org/echo__off/power-trello/raw/master/assets/icon-64.png
// @domain       trello.com
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @match        https://trello.com/b/*
// @match        https://trello.com/c/*
// @updateURL    https://bitbucket.org/echo__off/power-trello/raw/master/dist/userscript.js
// @downloadURL  https://bitbucket.org/echo__off/power-trello/raw/master/dist/userscript.js
// @license      MIT
// ==/UserScript==

(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 0);
})([ function(module, exports, __webpack_require__) {
    let css = __webpack_require__(1);
    class PowerTrello {
        constructor() {
            css.default.applyStyles();
            this.settings = {
                refreshTime: 1
            };
            this.dic = {
                team1: "pgd-01",
                team2: "pgd-02",
                teamTitle: "time",
                bug: "bug",
                open: "aberto",
                fixed: "corrigido",
                validated: "validado",
                branch: "branch"
            };
            this.config = {
                attributes: true,
                childList: true,
                characterData: false,
                attributeOldValue: true,
                attributeFilter: [ "class" ]
            };
            this.configWindow = {
                attributes: true,
                childList: true,
                characterData: false,
                attributeOldValue: true,
                attributeFilter: [ "style" ]
            };
            this.configWindowRecursive = {
                attributes: false,
                childList: true,
                characterData: false,
                attributeOldValue: false,
                subtree: true
            };
            this.readyEvents();
            this.loadEvents();
        }
        addBugIcon() {
            let dic = this.dic;
            let $labelsWithoutRed = $(".list-card");
            let $labels = $(".list-card .card-label.card-label-red");
            $labelsWithoutRed.each(function() {
                $(this).removeClass("has-bug");
            });
            $labels.each(function() {
                if ($(this)[0].innerText.toLowerCase() == dic.bug) {
                    $(this).parent().parent().parent().addClass("has-bug");
                }
            });
        }
        addTeamClasses() {
            let dic = this.dic;
            $(".list-card").each(function() {
                $(this).removeClass(dic.team1);
                $(this).removeClass(dic.team2);
            });
            $(".team").each(function() {
                $(this).removeClass("team");
            });
            $(".list-card .list-card-details .js-plugin-badges .badge-text").each(function() {
                let $parent = $(this).parent();
                let $grandParent = $parent.parent().parent().parent().parent().parent();
                let $innerText = $(this)[0].innerText.toLowerCase();
                $parent.removeClass(dic.open).removeClass(dic.validated).removeClass(dic.fixed).removeClass(dic.teamTitle).removeClass(dic.branch);
                if ($innerText.indexOf(dic.team1) > -1) {
                    $parent.addClass("team");
                    $grandParent.addClass(dic.team1);
                }
                if ($innerText.indexOf(dic.team2) > -1) {
                    $parent.addClass("team");
                    $grandParent.addClass(dic.team2);
                }
                if ($innerText.indexOf(dic.open) > -1) {
                    $parent.addClass(dic.open);
                }
                if ($innerText.indexOf(dic.fixed) > -1) {
                    $parent.addClass(dic.fixed);
                }
                if ($innerText.indexOf(dic.validated) > -1) {
                    $parent.addClass(dic.validated);
                }
                if ($innerText.indexOf(dic.branch) > -1) {
                    $parent.addClass(dic.branch);
                }
            });
        }
        addWindowTeamClasses(team) {
            this.removeWindowTeamClasses();
            $(".window").addClass(team.toLowerCase());
        }
        removeWindowTeamClasses() {
            let $window = $(".window");
            $window.removeClass(this.dic.team1);
            $window.removeClass(this.dic.team2);
        }
        removeBadgeClasses() {
            let dic = this.dic;
            $(".window .js-plugin-badges .card-detail-item").each(function() {
                $(this).removeClass(dic.open).removeClass(dic.validated).removeClass(dic.fixed).removeClass(dic.teamTitle).removeClass(dic.branch);
            });
        }
        addBadgeClasses() {
            let that = this;
            let dic = this.dic;
            this.removeBadgeClasses();
            $(".window .js-plugin-badges .card-detail-item").each(function() {
                let $innerText0 = $(this).children()[0].innerText.toLowerCase();
                let $innerText1 = $(this).children()[1].innerText;
                if ($innerText0.indexOf(dic.open) > -1) {
                    $(this).addClass(dic.open);
                }
                if ($innerText0.indexOf(dic.validated) > -1) {
                    $(this).addClass(dic.validated);
                }
                if ($innerText0.indexOf(dic.fixed) > -1) {
                    $(this).addClass(dic.fixed);
                }
                if ($innerText0.indexOf(dic.branch) > -1) {
                    $(this).addClass(dic.branch);
                }
                if ($innerText0.indexOf(dic.teamTitle) > -1) {
                    $(this).addClass(dic.teamTitle);
                    if ($innerText1.indexOf(dic.team1) > -1) {
                        that.addWindowTeamClasses(dic.team1);
                    } else if ($innerText1.indexOf(dic.team2) > -1) {
                        that.addWindowTeamClasses(dic.team2);
                    }
                }
            });
        }
        addBugClassToWindow() {
            let dic = this.dic;
            let $labels = $(".window .card-label.card-label-red");
            let $window = $(".window");
            let count = 0;
            $labels.each(function() {
                count = $(this)[0].innerText.toLowerCase() == dic.bug ? count + 1 : count;
            });
            $window.removeClass("has-bug");
            if ($labels.length > 0 && count > 0) {
                $window.addClass("has-bug");
            }
        }
        isQuickEditRemoved(removedNodes) {
            return removedNodes.className == "quick-card-editor";
        }
        isWindowUp(mutation) {
            let oldV = mutation.oldValue;
            let newV = mutation.target.className;
            let isWindowUp = false;
            if (oldV !== null && newV !== null) {
                isWindowUp = oldV.indexOf("window-up") > -1 && newV.indexOf("window-up") === -1 ? true : false;
            }
            return isWindowUp;
        }
        isWindowOpen(mutation) {
            return mutation.oldValue == "display: none;" || mutation.oldValue === null;
        }
        isWindowClosed(mutation) {
            return mutation.oldValue == "display: block;";
        }
        isBadgeAdded(mutations) {
            let that = this;
            let a = mutations.some(el => {
                let r = false;
                if (el.target.className === "js-plugin-badges" || el.previousSibling && el.previousSibling.className && el.previousSibling.className.indexOf("card-detail-item") || el.target.firstChild && el.target.firstChild.className && el.target.firstChild.className.indexOf("card-detail-item") > -1 || el.target.className && el.target.className.indexOf("card-detail-item") > -1) {
                    that.addBadgeClasses();
                    r = true;
                }
                return el.type == "childList" && r;
            });
            return a;
        }
        isBadgeRemoved(mutations) {
            let that = this;
            let dic = this.dic;
            let a = mutations.some(el => {
                let r = false;
                for (var property in el.removedNodes) {
                    if (el.removedNodes[property].innerText && (el.removedNodes[property].innerText.toLowerCase().indexOf(dic.team1) > -1 || el.removedNodes[property].innerText.toLowerCase().indexOf(dic.team2) > -1)) {
                        r = true;
                        that.removeWindowTeamClasses();
                        break;
                    }
                }
                return el.type == "childList" && r;
            });
            return a;
        }
        wereLabelsAdded(mutations) {
            let a = mutations.some(el => {
                let r = false;
                if (el.addedNodes.length > 0) {
                    for (var property in el.addedNodes) {
                        if (el.addedNodes.hasOwnProperty(property)) {
                            if (el.addedNodes[property].className && el.addedNodes[property].className.indexOf("card-label-red") > -1) {
                                r = true;
                                break;
                            }
                        }
                    }
                }
                return el.type == "childList" && r;
            });
            return a;
        }
        wereLabelsRemoved(mutations) {
            let a = mutations.some(el => {
                let r = false;
                if (el.removedNodes.length > 0) {
                    for (var property in el.removedNodes) {
                        if (el.removedNodes.hasOwnProperty(property)) {
                            if (el.removedNodes[property].className && el.removedNodes[property].className.indexOf("card-label-red") > -1) {
                                r = true;
                                break;
                            }
                        }
                    }
                }
                return el.type == "childList" && r;
            });
            return a;
        }
        readyEvents() {
            $(document).ready($ => {
                this.target = document.querySelector("body");
                this.windowTarget = document.querySelector(".window");
                this.windowRecursiveTarget = document.querySelector(".window");
                this.body = new MutationObserver(mutations => {
                    if (mutations.length > 0) {
                        if (mutations[0].attributeName === "class" && this.isWindowUp(mutations[0]) || mutations[0].removedNodes.length > 0 && this.isQuickEditRemoved(mutations[0].removedNodes[0])) {
                            this.addBugIcon();
                        }
                    }
                });
                this.windowDiv = new MutationObserver(mutations => {
                    if (mutations.length > 0) {
                        if (mutations[0].attributeName === "style" && this.isWindowOpen(mutations[0])) {
                            this.addBugClassToWindow();
                        }
                        if (mutations[0].attributeName === "style" && this.isWindowClosed(mutations[0])) {
                            this.addBugIcon();
                            this.addTeamClasses();
                        }
                    }
                });
                this.windowRecursiveDiv = new MutationObserver(mutations => {
                    if (mutations.length > 0) {
                        if (this.wereLabelsAdded(mutations) || this.wereLabelsRemoved(mutations)) {
                            this.addBugClassToWindow();
                        }
                        if (this.isBadgeAdded(mutations) || this.isBadgeRemoved(mutations)) {
                            this.addTeamClasses();
                        }
                    }
                });
                if (this.windowTarget) this.windowDiv.observe(this.windowTarget, this.configWindow);
                if (this.windowRecursiveTarget) this.windowRecursiveDiv.observe(this.windowRecursiveTarget, this.configWindowRecursive);
                if (this.target) this.body.observe(this.target, this.config);
                this.addBugIcon();
            });
        }
        loadEvents() {
            window.addEventListener("load", () => {
                setTimeout(() => {
                    this.addTeamClasses();
                }, 600);
                setInterval(() => {
                    this.addTeamClasses();
                    this.addBugIcon();
                }, 1e3 * 60 * this.settings.refreshTime);
            });
        }
    }
    new PowerTrello();
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: true
    });
    const css = __webpack_require__(2).toString();
    var Style;
    (function(Style) {
        function applyStyles() {
            let style = document.createElement("style");
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
        Style.applyStyles = applyStyles;
    })(Style || (Style = {}));
    __webpack_exports__["default"] = Style;
}, function(module, exports, __webpack_require__) {
    exports = module.exports = __webpack_require__(3)(false);
    exports.push([ module.i, 'body {\n  background-position: 50% 50%;\n}\n\n.header-logo {\n  filter: brightness(100);\n  opacity: 0.7;\n}\n\n.header-logo-default {\n  background-image: url("data:image/png;base64,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");\n}\n\n.window {\n  box-shadow: 0px -5px 0px #a6a6a6;\n}\n\n.window.pgd-01 {\n  box-shadow: 0px -5px 0px #ab7dab;\n}\n\n.window.pgd-02 {\n  box-shadow: 0px -5px 0px #5d9e9e;\n}\n\n.window.has-bug {\n  background-image: url("data:image/png;base64,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");\n  background-repeat: no-repeat;\n  background-size: 150px;\n  background-position: 105% -20px;\n}\n\n.window.has-bug .window-header .window-title textarea,\n.window .window-sidebar .window-module h3 {\n  text-shadow: #EDEFF0 1px 0px 0px, #EDEFF0 -1px 0px 0px, #EDEFF0 0px 1px 0px, #EDEFF0 0px -1px 0px;\n}\n\n.window .card-detail-badge.is-clickable {\n  text-decoration: none;\n  text-align: center;\n}\n\n.window .js-plugin-badges {\n  width: 100%;\n  float: left;\n}\n\n.window .js-plugin-badges .card-detail-item {\n  margin-right: 20px !important;\n}\n\n.window .js-plugin-badges .card-detail-item:last-of-type {\n  margin-right: 0 !important;\n}\n\n.window.pgd-01 .js-plugin-badges .card-detail-item.time .card-detail-badge {\n  background-color: #ab7dab;\n  color: #fff;\n  font-weight: 800;\n}\n\n.window.pgd-01 .js-plugin-badges .card-detail-item.time .card-detail-badge:hover {\n  opacity: .75;\n}\n\n.window.pgd-02 .js-plugin-badges .card-detail-item.time .card-detail-badge {\n  background-color: #5d9e9e;\n  color: #fff;\n  font-weight: 800;\n}\n\n.window.pgd-02 .js-plugin-badges .card-detail-item.time .card-detail-badge:hover {\n  opacity: .75;\n}\n\n.window .js-plugin-badges .card-detail-item.corrigido .card-detail-badge {\n  background-color: #85aed0;\n  color: #fff;\n  font-weight: 800;\n}\n\n.window .js-plugin-badges .card-detail-item.corrigido .card-detail-badge:hover {\n  opacity: .75;\n}\n\n.window .js-plugin-badges .card-detail-item.aberto .card-detail-badge {\n  background-color: #d08585;\n  color: #fff;\n  font-weight: 800;\n}\n\n.window .js-plugin-badges .card-detail-item.aberto .card-detail-badge:hover {\n  opacity: .75;\n}\n\n.window .js-plugin-badges .card-detail-item.validado .card-detail-badge {\n  background-color: #8cbd82;\n  color: #fff;\n  font-weight: 800;\n}\n\n.window .js-plugin-badges .card-detail-item.validado .card-detail-badge:hover {\n  opacity: .75;\n}\n\n.window .js-plugin-badges .card-detail-item.branch .card-detail-badge {\n  background-color: #d8884a;\n  color: #fff;\n  font-weight: 800;\n}\n\n.window .js-plugin-badges .card-detail-item.branch .card-detail-badge:hover {\n  opacity: .75;\n}\n\n.list-card a {\n  margin-top: 8px;\n}\n\n.list-card .placeholder {\n  padding-top: 2px;\n}\n\n.list-card:not(.placeholder) {\n  box-shadow: 0px -3px 0px #a6a6a6;\n  margin-bottom: 6px;\n  margin-top: 9px;\n}\n\n.list-card .list-card-labels .card-label {\n  height: auto;\n  line-height: 100%;\n  width: auto;\n  text-shadow: 0px 0px 1px #666;\n  padding: 5px 6px;\n  font-size: 11pt;\n  width: auto;\n  max-width: none;\n  min-width: auto;\n  pointer-events: none;\n}\n\n.list-card.has-bug {\n  background-size: 48px;\n  background-position: 106% -6px;\n  background-repeat: no-repeat;\n  background-image: url("data:image/png;base64,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");\n}\n\n.list-card .list-card-members .member {\n  border-radius: 50%;\n  border: 2px solid #a6a6a6;\n}\n\n.list-card.is-stickered.active-card .list-card-details, .list-card.is-stickered.active-card .list-card.is-stickered .list-card-details {\n  background-color: unset;\n}\n\n.list-card.is-stickered .list-card-details {\n  margin-top: unset;\n}\n\n.list-card.is-stickered .stickers {\n  position: absolute;\n  right: 0;\n  top: 100%;\n  transform: translateY(-100%);\n}\n\n.list-card.is-stickered .stickers .sticker {\n  top: 95% !important;\n  left: 99% !important;\n  transform: translateX(-100%) translateY(-100%);\n  height: 32px;\n  width: 32px;\n}\n\n.list-card.is-stickered .stickers .sticker img {\n  height: 100%;\n  width: 100%;\n  transform: rotate(0deg) !important;\n}\n\n.list-card .list-card-details .badges {\n  width: 100%;\n  margin-top: 5px;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.corrigido {\n  float: left;\n  width: 100%;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.corrigido .badge-text {\n  background-color: #85aed0;\n  padding: 4px;\n  border-radius: 4px;\n  text-shadow: #666666 0px 0px 1px;\n  color: #fff;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.aberto {\n  float: left;\n  width: 100%;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.aberto .badge-text {\n  background-color: #d08585;\n  padding: 4px;\n  border-radius: 4px;\n  text-shadow: #666666 0px 0px 1px;\n  color: #fff;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.validado {\n  float: left;\n  width: 100%;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.validado .badge-text {\n  background-color: #8cbd82;\n  padding: 4px;\n  border-radius: 4px;\n  text-shadow: #666666 0px 0px 1px;\n  color: #fff;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.branch {\n  float: left;\n  background-color: #d8884a;\n  margin-left: 2px;\n  border-radius: 2px;\n}\n\n.list-card .list-card-details .badges .js-plugin-badges .badge.branch .badge-text {\n  padding: 4px;\n  border-radius: 4px;\n  text-shadow: #666666 0px 0px 1px;\n  color: #fff;\n}\n\n.list-card .list-card-details .js-plugin-badges .badge.team {\n  float: right;\n  margin-right: 0px;\n}\n\n.list-card.pgd-01 {\n  box-shadow: 0px -3px 0px #ab7dab;\n  margin-bottom: 6px;\n  margin-top: 9px;\n}\n\n.list-card.pgd-01:first-child {\n  margin-top: 3px;\n}\n\n.list-card.pgd-01 .list-card-details .badges .js-plugin-badges .badge.team {\n  background-color: #ab7dab;\n  border-radius: 3px;\n  padding-left: 4px;\n  padding-right: 4px;\n}\n\n.list-card.pgd-01 .list-card-details .badges .js-plugin-badges .badge-text {\n  color: #fff;\n  font-weight: 800;\n}\n\n.list-card.pgd-01 .list-card-members .member {\n  border: 2px solid #ab7dab;\n}\n\n.list-card.pgd-02 {\n  box-shadow: 0px -3px 0px #5d9e9e;\n  margin-bottom: 6px;\n  margin-top: 9px;\n}\n\n.list-card.pgd-02:first-child {\n  margin-top: 3px;\n}\n\n.list-card.pgd-02 .list-card-details .badges .js-plugin-badges .badge.team {\n  background-color: #5d9e9e;\n  border-radius: 3px;\n  padding-left: 4px;\n  padding-right: 4px;\n}\n\n.list-card.pgd-02 .list-card-details .badges .js-plugin-badges .badge-text {\n  color: #fff;\n  font-weight: 800;\n}\n\n.list-card.pgd-02 .list-card-members .member {\n  border: 2px solid #5d9e9e;\n}\n\n.window-cover-stickers {\n  position: relative;\n  left: 0;\n  right: 0;\n  border: 0;\n  top: 0;\n}\n\n.window-cover-stickers .sticker {\n  left: 0 !important;\n  top: 0 !important;\n  position: relative;\n}\n\n.window-cover-stickers .sticker img {\n  opacity: 0.6;\n  transform: rotate(0deg) !important;\n}\n\n.window-cover-stickers-only {\n  position: absolute;\n  background: transparent;\n  box-shadow: none;\n  bottom: 0;\n  right: 0;\n  width: auto;\n  height: auto;\n}\n\n.card-label.mod-card-detail {\n  font-size: 11pt;\n}\n\n.list-header-num-cards.hide {\n  display: inline-block !important;\n}', "" ]);
}, function(module, exports) {
    module.exports = function(useSourceMap) {
        var list = [];
        list.toString = function toString() {
            return this.map(function(item) {
                var content = cssWithMappingToString(item, useSourceMap);
                if (item[2]) {
                    return "@media " + item[2] + "{" + content + "}";
                } else {
                    return content;
                }
            }).join("");
        };
        list.i = function(modules, mediaQuery) {
            if (typeof modules === "string") modules = [ [ null, modules, "" ] ];
            var alreadyImportedModules = {};
            for (var i = 0; i < this.length; i++) {
                var id = this[i][0];
                if (typeof id === "number") alreadyImportedModules[id] = true;
            }
            for (i = 0; i < modules.length; i++) {
                var item = modules[i];
                if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                    if (mediaQuery && !item[2]) {
                        item[2] = mediaQuery;
                    } else if (mediaQuery) {
                        item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                    }
                    list.push(item);
                }
            }
        };
        return list;
    };
    function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || "";
        var cssMapping = item[3];
        if (!cssMapping) {
            return content;
        }
        if (useSourceMap && typeof btoa === "function") {
            var sourceMapping = toComment(cssMapping);
            var sourceURLs = cssMapping.sources.map(function(source) {
                return "/*# sourceURL=" + cssMapping.sourceRoot + source + " */";
            });
            return [ content ].concat(sourceURLs).concat([ sourceMapping ]).join("\n");
        }
        return [ content ].join("\n");
    }
    function toComment(sourceMap) {
        var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
        var data = "sourceMappingURL=data:application/json;charset=utf-8;base64," + base64;
        return "/*# " + data + " */";
    }
} ]);
//# sourceMappingURL=userscript.js.map