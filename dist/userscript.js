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
            let oldV = mutation.oldValue;
            let newV = mutation.target.className;
            let isWindowUp = false;
            if (oldV !== null && newV !== null) {
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
    exports.push([ module.i, 'body{background-position:50% 50%}.header-logo{filter:brightness(100);opacity:.7}.header-logo-default{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8BAMAAAA9AI20AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUxpce7u7u/v7+vr6+zs7Orq6oODg7S0tNDQ0KOjo+Hh4b29vZeXl4uLi8XFxT+V3rMAAAAGdFJOUwBTIqqIzK5JkVEAAAQeSURBVFjD7VdNTxNRFJ2CpO1UGtYmmq5dGP+AiVtZ+StGCh1CWDAVhDQu6FAIaVxUa9TMikIJZIzRGjCEVYPJmKiLiR8x6coaUH6D9+O9N9MO7KYbwg10Zl6H894999zzHpp2GZdxwWN7wRkQsm5ZxUGt2rZp1d33g1j3+hh83rLmB8G2ixNsxrrsEVHAdfhNvo0TOdWyBCUlgC7FiHylZc03Fir34XaXfuKLJKjObm7adlMbea0d99X2oSdi7IPnldKed0Tja56Hlwx8gWxued4zIuCF99EN/XVF3DTtyvb4DN3K7tFrhgynbRidZcMwUUdazTDxsgFfVMUVmdyB68yZCWx2LZozITtzWSGbTo2hCUpCz8HzZ8xcXOGd/JnIQ82WtXBq26vzZRa3bgRxV0JPhaB9eJ7GmzZhZsQM/XHNPrUBe09LNFdvsGbSAXJek9CGo6BT+FjQBBMl4iXqROPr1Oj75XX6ruwIKs2iTVEKoA8VNE+Nr2ZpvW2RUzhudg8IS5/PlghbzwmqJ9Q7CjqvoDcIWpBv5DPyQUVTPwEauHtcbU+z1Te/DWMyCo1aYGio4l/B7iiML0KSt0PAia5VUZaUcbRMTqkRV11wotBfJLRvmBlRR1HxifCaG5blLimHgnc6Wko2OyacP+6F9okRgoYqPtBFHbV3ATmyzS2AVln8QeOGbhdL5TJ9Lzoh6C6MuAydRr5qQhRXlVpkZAFa5Tw8iyM5LSGMVfc5zcKrALrjM6BJSVWRtKp6d7KPj4VgHnLsDnD+hgd2pKx/KmgXm52h57CiUL+vqnPdMDTyEcxDJGMViykeWZTYVQWNTV0laB8JkHUksnv8o2UthR6Imgy6SUNMWP7U140uNsYEQqdYED4zrEcEkg2dEbIWuRoJpCH398TqS+45BQ0smSA7rOIU9Gmb6zhKJjZ2jnOXmfXELLl4ML6L1jqjoLNshaIXpeRqEfH1HEVEQQ9w6VbIZ7D6VQXNKCY5qiF7iOeLWogUi6C9gahWeJOEEh0G0Jy75ivoKXayf2caX09Fk65SS9CJoVWTl5qpwHELZNhT2XPsGtLuCugMlnAY7072KR71cM2biwlVLNCuCat3kmS252wy5frekPC8lCxhaCsIKYSburAhZYxNuUxc3IHPTgR5DUafyIOJsFj2hYiuuawFaR64gG8+NQ5y9CNyzOGtVVLzOAJdDUOjkZsq+VSPAiOMsEYPJTkWbTIsBYojKpQrodM95kxSoU1g9IxCsuCnlbEwY8k6x1P07JV63dmq17nfaFj2xwo+PKd04abvHKIrEYlj/Ex8J0pxjskJhcR4yJbQTvzQghBTix96yDfkCSNuroVCJvoUEktc73Fbqet4yPaNUCPJbown7sEW5w7oX9KtX4NCvozLuCjxHxaIebmIpFV3AAAAAElFTkSuQmCC")}.window{box-shadow:0 -5px 0 #a6a6a6}.window.pgd-01{box-shadow:0 -5px 0 #ab7dab}.window.pgd-02{box-shadow:0 -5px 0 #5d9e9e}.window.has-bug{background-image:url("data:image/png;base64,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");background-repeat:no-repeat;background-size:150px;background-position:105% -20px}.window.has-bug .window-header .window-title textarea,.window .window-sidebar .window-module h3{text-shadow:#edeff0 1px 0 0,#edeff0 -1px 0 0,#edeff0 0 1px 0,#edeff0 0 -1px 0}.window .card-detail-badge.is-clickable{text-decoration:none;text-align:center}.window.pgd-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#ab7dab;color:#fff;font-weight:800}.window.pgd-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window.pgd-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#5d9e9e;color:#fff;font-weight:800}.window.pgd-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge{background-color:#85aed0;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge{background-color:#d08585;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge{background-color:#8cbd82;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge{background-color:#d8884a;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge:hover{opacity:.75}.list-card a{margin-top:8px}.list-card .placeholder{padding-top:2px}.list-card:not(.placeholder){box-shadow:0 -3px 0 #a6a6a6;margin-bottom:6px;margin-top:9px}.list-card .list-card-labels .card-label{height:auto;line-height:100%;text-shadow:0 0 1px #666;padding:5px 6px;font-size:11pt;width:auto;max-width:none;min-width:auto;pointer-events:none}.list-card.has-bug{background-size:48px;background-position:106% -6px;background-repeat:no-repeat;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB+UExURUxpceUUAOUUAI4MAI0MAOYUAOYUAMoRAOUUAOQTAI0MAM8SAJAMAOUUAP///+UUAIwMAIkGAOYPAPry8ffs66M7MZEWC/Hc2uG9uuYoFqYLAKpLQtisqPDIxMmMhuhEM9IPALRgWPOooZssId0TALIbD9Sgmux2a71ya+xaTZfinVUAAAAOdFJOUwC54MhpVosa8WroNpXLBjUf0gAAAslJREFUSMeNltuiazAQhtWhWu0KiRARoSja93/BnUREqK6156plPpnDP4Pj7C0Mzif3EscX93QOQucPC68/8cZ+rr8x4fkSf9jlHH59+oG7Qo5PuZ3ir3a6ffoHrrhBaYy2rkhei2M32PvLcBDt+ES3AJ14R5EMa+evnkY7Avjb9n9zQOrhIX9uiGBOFz2GGmOLeGNc9xCWkrhYUd3cJeJHyQhuFv8GEwZhksyEazIP1/pIIi0eMRIWU54y4Z4sxCm0E1iJGrAHbRqK3qCe/SXxXNMIN/0SeeCq7jjvpg73CzATl/mI8+yI0ELwFChLC3OAMEmcrQOarpkJRAnQRnKdAhuZItQROoMJjA9FoA4YGzUwglcCk3LOYtazyLAYJIEasgJEJQH7ArTyxxD/iIh05A3BbSkINKUrkL4U0GKSqbOGOHQCDdBOFFEQdkQ6JliDUWczBLpGgphAlYvE0FRZ9hKNhnkFXku97s7SZTTrpqRNZlufw17oiy2A5xgZNVzEzDlON4a57EphOhg5a5ubEYNDwxVLjDmWKoY8qz8YXGd5khwD8QDzYg8UOUw2wEZ55X8Arg08h7+AyLGXC226dA+ko8hhZTzTOOV+XKWKrWnfF2kovYoJKHZHzFdqE5e/iE+JibewJ1tA6LXloDKNCxd5y04LAUC4y7oQlxjmGVxSMAOE1E6RUt60TcwBzIjRkr+OqJygXkqz2BfVzM8c0bIE5IzK1CCzJ04+GebjIu+7tWbUAKkBfqXbgZMDNJcpCtdFJoukb8NWn0FaqB+hy+Rbq1LNtN4RkNWcEF4zqC/omfZCaxnLImVmb+UZY5lpliyTuBfdNuueTu0qM6jM/Mtbec/fvVCew1bHlslSbf3VK+tZfiWshO2X4i9E5B++dr8S3u3Li/2YiPzw+6dD+el///Vr4+rtgvH//qDx716kIvHuB97/AAq8f2+I/DGLAAAAAElFTkSuQmCC")}.list-card .list-card-members .member{border-radius:50%;border:2px solid #a6a6a6}.list-card.is-stickered.active-card .list-card-details,.list-card.is-stickered.active-card .list-card.is-stickered .list-card-details{background-color:unset}.list-card.is-stickered .list-card-details{margin-top:unset}.list-card.is-stickered .stickers{position:absolute;right:0;top:100%;transform:translateY(-100%)}.list-card.is-stickered .stickers .sticker{top:95%!important;left:99%!important;transform:translateX(-100%) translateY(-100%);height:32px;width:32px}.list-card.is-stickered .stickers .sticker img{height:100%;width:100%;transform:rotate(0deg)!important}.list-card .list-card-details .badges{width:100%;margin-top:5px}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido .badge-text{background-color:#85aed0;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto .badge-text{background-color:#d08585;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado .badge-text{background-color:#8cbd82;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch{float:left;background-color:#d8884a;margin-left:2px;border-radius:2px}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch .badge-text{padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .js-custom-field-badges .badge.team{float:right;margin-right:0}.list-card.pgd-01{box-shadow:0 -3px 0 #ab7dab;margin-bottom:6px;margin-top:9px}.list-card.pgd-01:first-child{margin-top:3px}.list-card.pgd-01 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#ab7dab;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.pgd-01 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.pgd-01 .list-card-members .member{border:2px solid #ab7dab}.list-card.pgd-02{box-shadow:0 -3px 0 #5d9e9e;margin-bottom:6px;margin-top:9px}.list-card.pgd-02:first-child{margin-top:3px}.list-card.pgd-02 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#5d9e9e;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.pgd-02 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.pgd-02 .list-card-members .member{border:2px solid #5d9e9e}.window-cover-stickers{position:relative;left:0;right:0;border:0;top:0}.window-cover-stickers .sticker{left:0!important;top:0!important;position:relative}.window-cover-stickers .sticker img{opacity:.6;transform:rotate(0deg)!important}.window-cover-stickers-only{position:absolute;background:transparent;box-shadow:none;bottom:0;right:0;width:auto;height:auto}.card-label.mod-card-detail{font-size:11pt}.list-header-num-cards.hide{display:inline-block!important}', "" ]);
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