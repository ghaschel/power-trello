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
            this.target = null;
            this.windowTarget = null;
            this.windowRecursiveTarget = null;
            this.body = null;
            this.windowDiv = null;
            this.windowRecursiveDiv = null;
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
            $(".list-card .list-card-details .js-custom-field-badges .badge-text").each(function() {
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
            $(".window .js-custom-field-detail-badges .card-detail-item").each(function() {
                $(this).removeClass(dic.open).removeClass(dic.validated).removeClass(dic.fixed).removeClass(dic.teamTitle).removeClass(dic.branch);
            });
        }
        addBadgeClasses() {
            let that = this;
            let dic = this.dic;
            this.removeBadgeClasses();
            $(".window .js-custom-field-detail-badges .card-detail-item").each(function() {
                let $innerText0 = $(this).children()[0].innerText.toLowerCase();
                let $innerText1 = $(this).children()[1].innerText.toLowerCase();
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
            let oldV = mutation.oldValue || '';
            let newV = mutation.target.className;
            let isWindowUp = false;

            if (newV !== null) {
                isWindowUp = oldV.indexOf("window-up") > -1 && newV.indexOf("window-up") === -1 ? false : true;
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
                if (el.target.className === "js-plugin-badges" || el.previousSibling && el.previousSibling.className && el.previousSibling.className.indexOf("card-detail-item") > -1 || el.target.firstChild && el.target.firstChild.className && el.target.firstChild.className.indexOf("card-detail-item") > -1 || el.target.className && el.target.className.indexOf("card-detail-item") > -1) {
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
                            this.addBadgeClasses();
                            this.addTeamClasses();
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
    exports.push([ module.i, 'body{background-position:50% 50%}.header-logo{filter:brightness(100);opacity:.7}.header-logo-default{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAMAAAD48GC1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUxpcerq6oODg7S0tO3t7evr6+zs7OXl5e/v7+7u7qGhob29vdPT05eXl8XFxc3Nzdzc3I2Njaurq4iIiAqGILEAAAAKdFJOUwDM//9mqoj+IkQ8oMw1AAAEQElEQVRo3u1Z23aEIAy0si1qEAL+/78WlUsI6O6+6TnmoesFcQiTSWK77rHHHnvssVuaBAHyZphRrKZuhloZYzCdaQE3WYA0egyHg/Z+vwdbECAtQKrr+vqndKfR4UDAz2WJDJ4FpbNNAH1VN/+tkAVKIcBgdKzU+e8VbYXsHWsUInrxUApXrvzAy6uHfCOQ08xs7GD79Ts0xYO0oduFdLoPnOMrcBs/mTx8vwDtVytk8oEeukT4k5QzFX6c+tpkN2+/ulP7BTumB7bxS5ovPOHidOE8rlIu+7n4QkHMqnZklS+eKU0Dcr/IHVoG3U8laJs2OD7CLlg6Oq/pAxu8o1fagNYrYQwIqUrFxr5pfxXoHtqgbbyf4mamMKFcwhsbPbE9VM/wFfbm3pcnDLx0oTBTE7PratA9tkDn24nlkRCKkAc/EBLPCk/nGClghNH5MSPycZh0EYaa6lqg5xZosug0q87endkuHTECfaVB5UJ6OmjTqXxNDpzRpp6nBh15SUHLvrpNeQw8HupiQ3pB9lwAZCln9TauYlg/ow93rwE6rI2C3qNOz0UoJqKLnSjL7xGFV5VQck0v7M6uFjCsJVSld8HTs/wI9PLioO1+DGUosvA2R17eCmjohK7bAZIaFX8+ba/TeAbakn0moE2QYFmGYhKNU7X7EwF0vRE6kEJtv8iTIwkkOwmyFSVoLXJEEdBTyEThgKx7rlWlQraDblDzV8So09vByErUqE/pFU43QUeaIgUtk/sV92meF0+7K9ESFp1rah0VsNgOtFykLdSgIaVzClrkhL3Nsgx1poWzWqmNWZKiNPZfvqwqvC0q2FMDdEzPjoC2eft5KCZWH9YcW6rW7TuEw2FVUiFboBLzwlFXoCNNjYugDdUGW/IX32rH2rniAddHsmMmaw2f6qVgsjS71aADTRcbQe9DYE+ic0lgy3Tyi1am5MyYgpJ3OIn2Lm1qDTpmosht2S5aNnOMbN99/Sh4ADqv5iCoQ1xOLdCFPuaitKhpx44v733lUWmKLq/I5OojqkEQ1xZosumWnnCAsQzTy8c13kl4JsfjYas7nXia5HTb7h72UEy1nf6qmg4U5aAhYf3NQk5NzCecJn2Kx7EPIH2ljV4VGf9XfYsS0+QrpcGULDBVALp254IHoFN6nrFSYRnwmdRnet8sPRfwQ8hh6mmovozwcm7+rHMBnp5nl4Cx5lFZitOkpvONZbbZuvdWw3vQrjsEHWm6NNRM9Q2hc5/pHvK4KJVbFKgbEjCbvBoIHoB2V8kkiEyWC3/7UTAWvaquq5Tikuc+NSdiXW22c+xwu0yzmsuj+RbnO3mL5T7+/LuHrCWIlYNX/AxZ1pkDZ8clv1Qb/q3oDqDLptJ2twA9LP1hiXVZTpdJzrxRj6vYaI9r2Uqnr8Nqe1x/84x4of9kuL1jg+5WJt1ibwb5sccee+yxi9g/DC04YLQL8sAAAAAASUVORK5CYII=")}.window{box-shadow:0 -5px 0 #a6a6a6}.window.pgd-01{box-shadow:0 -5px 0 #ab7dab}.window.pgd-02{box-shadow:0 -5px 0 #5d9e9e}.window.has-bug{background-image:url("data:image/png;base64,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");background-repeat:no-repeat;background-size:150px;background-position:105% -20px}.window.has-bug .window-header .window-title textarea,.window .window-sidebar .window-module h3{text-shadow:#edeff0 1px 0 0,#edeff0 -1px 0 0,#edeff0 0 1px 0,#edeff0 0 -1px 0}.window .card-detail-badge.is-clickable{text-decoration:none;text-align:center}.window.pgd-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#ab7dab;color:#fff;font-weight:800}.window.pgd-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window.pgd-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#5d9e9e;color:#fff;font-weight:800}.window.pgd-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge{background-color:#85aed0;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge{background-color:#d08585;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge{background-color:#8cbd82;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge{background-color:#d8884a;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge:hover{opacity:.75}.list-card a{margin-top:8px}.list-card .placeholder{padding-top:2px}.list-card:not(.placeholder){box-shadow:0 -3px 0 #a6a6a6;margin-bottom:6px;margin-top:9px}.list-card .list-card-labels .card-label{height:auto;line-height:100%;text-shadow:0 0 1px #666;padding:5px 6px;font-size:11pt;width:auto;max-width:none;min-width:auto;pointer-events:none}.list-card.has-bug{background-size:48px;background-position:106% -6px;background-repeat:no-repeat;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADkUExURUxpceYUAI4MAOUUAbsQANMSAOYUANkSAOUUAOMTAM8SAOUUAIwMAI0MAOUUAOUUAI0MAOUUAI0MAOUUAJIMAIwMAOUUAI0MAI4MAOUUAIwMAP///4sJAIYBAIkGAOUOAOkTAPry8aM7MfXs65AUCNisqOC9uu7Y1pssIeYsGqhIP9QSAd0TAPStpokLAPPh3+fLyPfEv+hKOr1ya8uRi6QOAMeGgKwPAbJbU61PRuxaTfzr6bZlXeYhDuc7KrMRA/37+tSkn5QdEu5yZtOZk/CakcwJAK8sIJsBAPCCeN5tY+e9ubz8RBYAAAAZdFJOUwCLyPwhBVYW8Wg2u/pybuJey+Tclu64kgpLtXSuAAADQ0lEQVRIx42Wd3uqMBTGHTjrqtr2QkIQgjKUCu69rW3v9/8+NwEiQ23v+/iHkPNLckZOSCTiymWTT418Op1vPCWzucQvyhWe+YieCz8xXDLP3yif5B7NXrlj7iKVu6sUX/mHei3emGeyVTJgGLwUNZXoO56vZjMx+wLZjmRYztGIAsbRsQwySb6Qidqn6WzGuQ+cRdh+4YD+6NIl/9IRIuu52+peJngZIhZLPNERGlMinw35W/UNWt3PubYcMPvBUpuLSBDeXaJ69TwXxIcS8t8uLxHxa0eeiwKVR7yy6FZCmybECMw/1pvNWlqAkWdPiR4ZrPj5jeSr9XHB7YnlONaXhXUkMGJKiLyX86QXcElihCMDV3KHLYBE5BJJ1wNvgcF54BGSoQFf2gF69ubJhJAQeepFwTVLf4HTR8sFzjsG7E7eEvAEhgIUpjxfIIBXz8TDzqVLCGnTB1f1dboE0jtgRv9s+WeyI79mBn08+ySEdJQDQB7SJcQZ7iuu+1s+l8j6gGGBiTjutiQLhLR3gQnY+95ss36MCHEE7QMa96TvdkhDEQro0AZD6MermXhigFs34tTYKGHpKtInGM9ZQlKJBgM2DtjJtr2UI8K2Le9A55rBeiJI82CPwV3htskSLpQS6aAqtqoyumHwSFGFkMIAv4VqJw50VChEgEjlTf8DaISB3vYWOESA+jWsVOuBJccBeU98CJjUNXGuOam3OEBetM3A7SYrDbdeyQnoxJbw3kyujtRY8bnFZK+grkUBTYcrG7R1BnCsvGmm8VyEMOZ1B0Jxjm0FMRfYASL1vdRMJIirSOrwShSQomHTB8rBEaUniFRMLHU0C+758YASFzQB/gj21DXRDJ84k5wHqO5Zeb+F2sz67HchcShHDxw9QCM3fS9c0MhokLxhCFd+pLQVhN4UfpjKoVYpbTQ883sEMkd2v2+PTOR3mRnWaJhSuVAzpkFisROQqpimol4fSZjI2Esx0u7X37OgLiEiCp7U2eoAS7XYhdLbvgsPBOmvnIlfWb3pQ4JkoPzn9lL8gajXMveu3d74AZEqPrjY7xMv5dzjT4fx7e7fuB8/TlKxzZS53z5ouFozVS+RmeupZu3W+h/VmtkrMtaA/wAAAABJRU5ErkJggg==")}.list-card .list-card-members .member{border-radius:50%;border:2px solid #a6a6a6}.list-card.is-stickered.active-card .list-card-details,.list-card.is-stickered.active-card .list-card.is-stickered .list-card-details{background-color:unset}.list-card.is-stickered .list-card-details{margin-top:unset}.list-card.is-stickered .stickers{position:absolute;right:0;top:100%;transform:translateY(-100%)}.list-card.is-stickered .stickers .sticker{top:95%!important;left:99%!important;transform:translateX(-100%) translateY(-100%);height:32px;width:32px}.list-card.is-stickered .stickers .sticker img{height:100%;width:100%;transform:rotate(0deg)!important}.list-card .list-card-details .badges{width:100%;margin-top:5px}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido .badge-text{background-color:#85aed0;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto .badge-text{background-color:#d08585;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado .badge-text{background-color:#8cbd82;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch{float:left;background-color:#d8884a;margin-left:2px;border-radius:2px}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch .badge-text{padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .js-custom-field-badges .badge.team{float:right;margin-right:0}.list-card.pgd-01{box-shadow:0 -3px 0 #ab7dab;margin-bottom:6px;margin-top:9px}.list-card.pgd-01:first-child{margin-top:3px}.list-card.pgd-01 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#ab7dab;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.pgd-01 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.pgd-01 .list-card-members .member{border:2px solid #ab7dab}.list-card.pgd-02{box-shadow:0 -3px 0 #5d9e9e;margin-bottom:6px;margin-top:9px}.list-card.pgd-02:first-child{margin-top:3px}.list-card.pgd-02 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#5d9e9e;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.pgd-02 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.pgd-02 .list-card-members .member{border:2px solid #5d9e9e}.window-cover-stickers{position:relative;left:0;right:0;border:0;top:0}.window-cover-stickers .sticker{left:0!important;top:0!important;position:relative}.window-cover-stickers .sticker img{opacity:.6;transform:rotate(0deg)!important}.window-cover-stickers-only{position:absolute;background:transparent;box-shadow:none;bottom:0;right:0;width:auto;height:auto}.card-label.mod-card-detail{font-size:11pt}.list-header-num-cards.hide{display:inline-block!important}', "" ]);
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