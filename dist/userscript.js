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
            let oldV = mutation.oldValue || "";
            let newV = mutation.target.className || "";
            return oldV.indexOf("window-up") === -1 && newV.indexOf("window-up") > -1;
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
                    if (mutations.length === 0) return;
                    let m = mutations[0];
                    if (m.attributeName === "class" && this.isWindowUp(m) || m.removedNodes.length > 0 && this.isQuickEditRemoved(m.removedNodes[0])) {
                        this.addBugIcon();
                        this.addBadgeClasses();
                        this.addTeamClasses();
                    }
                });
                this.windowDiv = new MutationObserver(mutations => {
                    if (mutations.length > 0) {
                        console.log("windowDiv");
                        console.log("isWindowOpen", this.isWindowOpen(mutations[0]));
                        console.log("isWindowClosed", this.isWindowClosed(mutations[0]));
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
                        console.log("windowRecursive");
                        console.log("wereLabelsAdded", this.wereLabelsAdded(mutations));
                        console.log("wereLabelsRemoved", this.wereLabelsRemoved(mutations));
                        console.log("isBadgeAdded", this.isBadgeAdded(mutations));
                        console.log("isBadgeremoved", this.isBadgeRemoved(mutations));
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
    exports.push([ module.i, 'body{background-position:50% 50%}.header-logo{filter:brightness(100);opacity:.7}.header-logo-default{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAMAAAD48GC1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAeUExURUxpcdHR0e/v7+zs7IODg7S0tMHBwZGRkaOjo+Hh4Ukvdx8AAAAEdFJOUwD+O5ogoa0iAAADx0lEQVRo3u2Z25aDIAxFDUpC/v+HB+UWQsDOm65lHqatVWcTDifBbtsXX3zxxRevDEaP/DZmfwa8jBpitEzHtL9kAAzo8luHMe/8El1jfRtH8NhcQ59OKNQPlgecKlASydBPZd5PZM/ROBAKbJRI+/vEyCYXXSMq+HIPvrIfV+ONZbMPpMJteL3GG4bypk7odaBZU7qi/Au+zg/tfEgHcOIWCu1iZ8adpWYGfg7HGLzR9YobpAPk6gXX+RWa8xVBfa5znW50+H/5XpwAMUqnKyUYyEfMW+ihK5SG9uUSdYDk2fLy23Ax0adsEPFSDHqG3rH5MGMfoA+0oWn4niQmqiHd8UZGvPRxUnMaQpQ4dg4TTOawjdAHW9Dt6yYYagJhde3KSM5aUiUe0T0IUYBIdb4peehis6DJgg7HMCiZXVKzMM1w7DSkbjkyxtoisNlpRRs2PkIXXUpoPoavpY7xVtDR4mLl9sNKO4d5HgMDDaezZ0DnsUnotOqQlG6LY6RX2mcJPpULbDRGaQynXQ+mWDNN/BN08j0JnWlRiaBf3rBsoHHzOLZN4mVIdr170AWoh5aOIKAhWzBri0BTNmrl+Qw9TkRplRIv22zpfwYvpqKHRt9WlIAORVxBq4xGVxnIEjRbwymrLnXXTvV7TKqslHqroAsFS2iumQSd03ZfXorDW8YiemosR/YVdeRBCxpq3hq0b5IlVevrWsBVr2Qzs2hKy9zHQ122PRm1ZYAu5TkIaGEaeilWVfulOtD+RswO1s5KnQyeaF0RsckUKjRIb1Cux7fesc0eGMTRyBmDJid9KwcYSFa3EToLiSpePiUVUeoFTMon/7GV6fPv6gj0DqfKPtRJHaE7HyO71wpGSxP+xcxaNHVVwnRzntMZLOjOH1tTegzlpxvefecxeAr2R7imeiY1zEwWdO++ZPWHKNswpJ97vMXyrB95Ch0Wme5aPnP3IFzlvOh/3XR5oKegsbLuTTIyPC00LfYpdSrkxrJkVexd/rVvAR/ObsKpZgOGBWhvAkz36ARCPLhwqY8gSuFOP8saSn/jhicjWl70284FdQGlMKo1GTh0nPM20u43zXMZ3D20WRHVtsSYdliY351AWK+LXh/e3UBTayYM6E5QMJ221vjTT4sxLDxyMJSo/S5qaYXrY9wMXa9yoOJsnZL2jdiG5hv/nGg9wNQOPvExpFWihDoe+aQa9LOiN0Cv5PFYaEfHtMV6rKZ794Ab93hiqsOdTz9H1TTvv3VFfNAvGWnnRI/91WKS7EBvQ/7iiy+++OIh8QdeSy4/97ETUwAAAABJRU5ErkJggg==")}.window{box-shadow:0 -5px 0 #a6a6a6}.window.pgd-01{box-shadow:0 -5px 0 #ab7dab}.window.pgd-02{box-shadow:0 -5px 0 #5d9e9e}.window.has-bug{background-image:url("data:image/png;base64,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");background-repeat:no-repeat;background-size:150px;background-position:105% -20px}.window.has-bug .window-header .window-title textarea,.window .window-sidebar .window-module h3{text-shadow:#edeff0 1px 0 0,#edeff0 -1px 0 0,#edeff0 0 1px 0,#edeff0 0 -1px 0}.window .card-detail-badge.is-clickable{text-decoration:none;text-align:center}.window.pgd-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#ab7dab;color:#fff;font-weight:800}.window.pgd-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window.pgd-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#5d9e9e;color:#fff;font-weight:800}.window.pgd-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge{background-color:#85aed0;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge{background-color:#d08585;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge{background-color:#8cbd82;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge{background-color:#d8884a;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge:hover{opacity:.75}.list-card a{margin-top:8px}.list-card .placeholder{padding-top:2px}.list-card:not(.placeholder){box-shadow:0 -3px 0 #a6a6a6;margin-bottom:6px;margin-top:9px}.list-card .list-card-labels .card-label{height:auto;line-height:100%;text-shadow:0 0 1px #666;padding:5px 6px;font-size:11pt;width:auto;max-width:none;min-width:auto;pointer-events:none}.list-card.has-bug{background-size:48px;background-position:106% -6px;background-repeat:no-repeat;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABXUExURUxpceYUAOUUAM8SAI4MAI4MAOUUAN0SAMoRAOUTAIwMAOUTAP///4kGAOnDv6A1K6oQBvry8ffs69eoo5EWC+pLO/Hc2rhnX+YoFqpLQsmMhvOooex2axhtu6QAAAAKdFJOUwCL4DZ517/5GmIkriCPAAACfElEQVRIx42W66JtIBCAsUSopJTC+z/n6aYL1tpnfu1d8zX3sarqLnCou6afpr7p6gFWfwgcuqmQ7icD6356SF/Dr6+/qDvk3cqnm75K93nqD425UOqp7M6a4aFv3VEHOW+IOsmhnFs3fX97SEREri8Ikjt1sQ2P9+07dGcsIwRj+4yxI3IbnyYmhGqZCMGkxngcPdHEyGGWH0MsJNhTZNFGfbyIDhYBRGJHuldCqEmg3etfRHAKlvXqKeP7QchxHmy+AE/03kR9LyxZkJOFRAPYR15nBsRxxaokCiLXEILm2hHORIjgRDy4dqAoPAAcbSMeqY8ipEgg4gskZAKkCwLPBG32Dzp1xqMr55JtjjiXBCxOD2/Mk4aAMafqMEm0ROZR8AnviIdo6JBydNpTQ5w8k80UGq/ce2Slrbqyb6gScyErnk1/6QsAVZM1psk8YUshjNiqkDkBqcyCM/QqjOsxSpWVmK7G+kN7n9dxfAcmildyB8iKxwIoOo/+B9CUnfoXAKp8uShxLHdg4SYGnAF1rv6eJa5T2G02bqerw82EP9nXVGk4pWYiG55lCZiu2wjisXAwtreptGkAjG9RE3OkWaw0yFaA2ym2lYuyma4zVmMvtdkOEK5jbqWzSY3z4z2KS+D0TY91PnH25ay922zNuAFyA7wt5cDZAfJpAjBbZAYI13gLNqQdH/dESFObr0o702FHYL0TKcmucTgIMw1gvozFNehWY521nmOxbJrMHfgU616dW2oz7CT+t272rr19UHpa9nEmNlWlvrPxg8gCzj+KPwjQvn52vxLg8+XD/k6AFn7/6UBfvP/5a2MA//t6YtoWOAqA9kX7H2DFWshZhSc9AAAAAElFTkSuQmCC")}.list-card .list-card-members .member{border-radius:50%;border:2px solid #a6a6a6}.list-card.is-stickered.active-card .list-card-details,.list-card.is-stickered.active-card .list-card.is-stickered .list-card-details{background-color:unset}.list-card.is-stickered .list-card-details{margin-top:unset}.list-card.is-stickered .stickers{position:absolute;right:0;top:100%;transform:translateY(-100%)}.list-card.is-stickered .stickers .sticker{top:95%!important;left:99%!important;transform:translateX(-100%) translateY(-100%);height:32px;width:32px}.list-card.is-stickered .stickers .sticker img{height:100%;width:100%;transform:rotate(0deg)!important}.list-card .list-card-details .badges{width:100%;margin-top:5px}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido .badge-text{background-color:#85aed0;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto .badge-text{background-color:#d08585;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado .badge-text{background-color:#8cbd82;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch{float:left;background-color:#d8884a;margin-left:2px;border-radius:2px}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch .badge-text{padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .js-custom-field-badges .badge.team{float:right;margin-right:0}.list-card.pgd-01{box-shadow:0 -3px 0 #ab7dab;margin-bottom:6px;margin-top:9px}.list-card.pgd-01:first-child{margin-top:3px}.list-card.pgd-01 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#ab7dab;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.pgd-01 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.pgd-01 .list-card-members .member{border:2px solid #ab7dab}.list-card.pgd-02{box-shadow:0 -3px 0 #5d9e9e;margin-bottom:6px;margin-top:9px}.list-card.pgd-02:first-child{margin-top:3px}.list-card.pgd-02 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#5d9e9e;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.pgd-02 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.pgd-02 .list-card-members .member{border:2px solid #5d9e9e}.window-cover-stickers{position:relative;left:0;right:0;border:0;top:0}.window-cover-stickers .sticker{left:0!important;top:0!important;position:relative}.window-cover-stickers .sticker img{opacity:.6;transform:rotate(0deg)!important}.window-cover-stickers-only{position:absolute;background:transparent;box-shadow:none;bottom:0;right:0;width:auto;height:auto}.card-label.mod-card-detail{font-size:11pt}.list-header-num-cards.hide{display:inline-block!important}', "" ]);
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