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
// @icon         https://raw.githubusercontent.com/ghaschel/power-trello/master/assets/icon-48.png
// @icon64       https://raw.githubusercontent.com/ghaschel/power-trello/master/assets/icon-64.png
// @domain       trello.com
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @match        https://trello.com/b/*
// @match        https://trello.com/c/*
// @updateURL    https://raw.githubusercontent.com/ghaschel/power-trello/master/dist/userscript.js
// @downloadURL  https://raw.githubusercontent.com/ghaschel/power-trello/master/dist/userscript.js
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
                team1: "team-01",
                team2: "team-02",
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
                let ps = el.previousSibling;
                let t = el.target;
                let fc = t.firstChild;
                if (el.target.className === "js-plugin-badges" || ps && ps.className && ps.className.indexOf("card-detail-item") > -1 || fc && fc.className && fc.className.indexOf("card-detail-item") > -1 || t.className && t.className.indexOf("card-detail-item") > -1) {
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
                let rn = el.removedNodes;
                for (var property in rn) {
                    if (rn[property].innerText && (rn[property].innerText.toLowerCase().indexOf(dic.team1) > -1 || rn[property].innerText.toLowerCase().indexOf(dic.team2) > -1)) {
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
                let an = el.addedNodes;
                if (an.length > 0) {
                    for (var property in an) {
                        if (an.hasOwnProperty(property) && an[property].className && an[property].className.indexOf("card-label-red") > -1) {
                            r = true;
                            break;
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
                let rn = el.removedNodes;
                if (rn.length > 0) {
                    for (var property in rn) {
                        if (rn.hasOwnProperty(property) && rn[property].className && rn[property].className.indexOf("card-label-red") > -1) {
                            r = true;
                            break;
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
                    if (mutations.length === 0) return;
                    let m = mutations[0];
                    if (m.attributeName === "style" && this.isWindowOpen(m)) {
                        this.addBugClassToWindow();
                    }
                    if (m.attributeName === "style" && this.isWindowClosed(m)) {
                        this.addBugIcon();
                        this.addTeamClasses();
                    }
                });
                this.windowRecursiveDiv = new MutationObserver(mutations => {
                    if (mutations.length === 0) return;
                    if (this.wereLabelsAdded(mutations) || this.wereLabelsRemoved(mutations)) {
                        this.addBugClassToWindow();
                    }
                    if (this.isBadgeAdded(mutations) || this.isBadgeRemoved(mutations)) {
                        this.addTeamClasses();
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
    exports.push([ module.i, 'body{background-position:50% 50%}.header-logo{filter:brightness(100);opacity:.7}.header-logo-default{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAA8CAMAAAD48GC1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAeUExURUxpcdHR0e/v7+zs7IODg7S0tMHBwZGRkaOjo+Hh4Ukvdx8AAAAEdFJOUwD+O5ogoa0iAAADx0lEQVRo3u2Z25aDIAxFDUpC/v+HB+UWQsDOm65lHqatVWcTDifBbtsXX3zxxRevDEaP/DZmfwa8jBpitEzHtL9kAAzo8luHMe/8El1jfRtH8NhcQ59OKNQPlgecKlASydBPZd5PZM/ROBAKbJRI+/vEyCYXXSMq+HIPvrIfV+ONZbMPpMJteL3GG4bypk7odaBZU7qi/Au+zg/tfEgHcOIWCu1iZ8adpWYGfg7HGLzR9YobpAPk6gXX+RWa8xVBfa5znW50+H/5XpwAMUqnKyUYyEfMW+ihK5SG9uUSdYDk2fLy23Ax0adsEPFSDHqG3rH5MGMfoA+0oWn4niQmqiHd8UZGvPRxUnMaQpQ4dg4TTOawjdAHW9Dt6yYYagJhde3KSM5aUiUe0T0IUYBIdb4peehis6DJgg7HMCiZXVKzMM1w7DSkbjkyxtoisNlpRRs2PkIXXUpoPoavpY7xVtDR4mLl9sNKO4d5HgMDDaezZ0DnsUnotOqQlG6LY6RX2mcJPpULbDRGaQynXQ+mWDNN/BN08j0JnWlRiaBf3rBsoHHzOLZN4mVIdr170AWoh5aOIKAhWzBri0BTNmrl+Qw9TkRplRIv22zpfwYvpqKHRt9WlIAORVxBq4xGVxnIEjRbwymrLnXXTvV7TKqslHqroAsFS2iumQSd03ZfXorDW8YiemosR/YVdeRBCxpq3hq0b5IlVevrWsBVr2Qzs2hKy9zHQ122PRm1ZYAu5TkIaGEaeilWVfulOtD+RswO1s5KnQyeaF0RsckUKjRIb1Cux7fesc0eGMTRyBmDJid9KwcYSFa3EToLiSpePiUVUeoFTMon/7GV6fPv6gj0DqfKPtRJHaE7HyO71wpGSxP+xcxaNHVVwnRzntMZLOjOH1tTegzlpxvefecxeAr2R7imeiY1zEwWdO++ZPWHKNswpJ97vMXyrB95Ch0Wme5aPnP3IFzlvOh/3XR5oKegsbLuTTIyPC00LfYpdSrkxrJkVexd/rVvAR/ObsKpZgOGBWhvAkz36ARCPLhwqY8gSuFOP8saSn/jhicjWl70284FdQGlMKo1GTh0nPM20u43zXMZ3D20WRHVtsSYdliY351AWK+LXh/e3UBTayYM6E5QMJ221vjTT4sxLDxyMJSo/S5qaYXrY9wMXa9yoOJsnZL2jdiG5hv/nGg9wNQOPvExpFWihDoe+aQa9LOiN0Cv5PFYaEfHtMV6rKZ794Ab93hiqsOdTz9H1TTvv3VFfNAvGWnnRI/91WKS7EBvQ/7iiy+++OIh8QdeSy4/97ETUwAAAABJRU5ErkJggg==")}.window{box-shadow:0 -5px 0 #a6a6a6}.window.team-01{box-shadow:0 -5px 0 #ab7dab}.window.team-02{box-shadow:0 -5px 0 #5d9e9e}.window.has-bug{background-image:url("data:image/png;base64,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");background-repeat:no-repeat;background-size:150px;background-position:105% -20px}.window.has-bug .window-header .window-title textarea,.window .window-sidebar .window-module h3{text-shadow:#edeff0 1px 0 0,#edeff0 -1px 0 0,#edeff0 0 1px 0,#edeff0 0 -1px 0}.window .card-detail-badge.is-clickable{text-decoration:none;text-align:center}.window.team-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#ab7dab;color:#fff;font-weight:800}.window.team-01 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window.team-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge{background-color:#5d9e9e;color:#fff;font-weight:800}.window.team-02 .js-custom-field-detail-badges .card-detail-item.time:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge{background-color:#85aed0;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.corrigido:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge{background-color:#d08585;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.aberto:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge{background-color:#8cbd82;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.validado:not(.editing) .card-detail-badge:hover{opacity:.75}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge{background-color:#d8884a;color:#fff;font-weight:800}.window .js-custom-field-detail-badges .card-detail-item.branch:not(.editing) .card-detail-badge:hover{opacity:.75}.list-card a{margin-top:8px}.list-card .placeholder{padding-top:2px}.list-card:not(.placeholder){box-shadow:0 -3px 0 #a6a6a6;margin-bottom:6px;margin-top:9px}.list-card .list-card-labels .card-label{height:auto;line-height:100%;text-shadow:0 0 1px #666;padding:5px 6px;font-size:11pt;width:auto;max-width:none;min-width:auto;pointer-events:none}.list-card.has-bug{background-size:48px;background-position:106% -6px;background-repeat:no-repeat;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABFUExURUxpceYUAIwMAeUTAOUUAI4MAI4MAN0SAMwRAOUTAP///4kGAPnv7qQ8M+GoounDv6oQBupLO/Hc2rhnX+YoFsmMhux2a3OLEdkAAAAKdFJOUwCL///Nedf5H2IVGYJtAAACV0lEQVRIx42WWaKrIAxAKwIiIAFE97/Ux6QEtL0vXy3NIXPo5zOKWCdKl3leKJ1W8flDxErnTuhPRkzL/JBlEl9vf1HPyLsVQeevQl+I7HwIT+V8RteHfnInGDgHJJxgQnZr0C+/Gi/BYX0H0h82x7Y+7k/32ENrRDitj02pTGAbLd7Fbr4RTvuoTkghWuQ4P5HQUO0F0FtUJw9i7ZJuD7ktwbkwO3kU/YuoTom+XovV5jAA5jSXgYtYiolpLCxomUXDbUCVyCdkwJkr1uBlFU9qCJspucomagSnNNU1I28xFTByj6wtUdQUOQmlQM43wOcg1AZyTx/sTKNHV8693jNx6gborKd2XchIiDunwcQkJgJ5VH1ShzQ1Gru2HJ3pNBKnQbLHQitiikdJ2If2fWOD2zqJEcT+ugvCEQAp86AHgVQVQEArszNavoo2G7nlg0psSbT+0D6Q9gDMVhEYASCqB7rOs/8B0L5T/wJ4B4SXuHPECgETVn/PEk4SQ+N2ljoMBvLJQVqlxdyaCXa1+R6IXbdDtHEB4m7vWOnYAEoNUUM8imvhAjhaAXmnpFbuPIpdF63evcTQDnC5Y4bSpaTe81M8upfAWZq+iyLPDWpvhtZMHiBS5qsfuDRAJU1coEUWrmuU2qsNn8YnX1HTxPCqTDNdd0QcGfAejk3VgzrTvFuu7hr0pEHKrF1fS5q46NZ9OPfWMirL/Y3s6Tc2PCiL7fsYSU4VezxZPwgUMH4UfxCcvT67Xwkuvjzs7wRn4vtfB/vi/c9/Gyv/39sbwxjPFOfsRfsfaX00Go5qJkMAAAAASUVORK5CYII=")}.list-card .list-card-members .member{border-radius:50%;border:2px solid #a6a6a6}.list-card.is-stickered.active-card .list-card-details,.list-card.is-stickered.active-card .list-card.is-stickered .list-card-details{background-color:unset}.list-card.is-stickered .list-card-details{margin-top:unset}.list-card.is-stickered .stickers{position:absolute;right:0;top:100%;transform:translateY(-100%)}.list-card.is-stickered .stickers .sticker{top:95%!important;left:99%!important;transform:translateX(-100%) translateY(-100%);height:32px;width:32px}.list-card.is-stickered .stickers .sticker img{height:100%;width:100%;transform:rotate(0deg)!important}.list-card .list-card-details .badges{width:100%;margin-top:5px}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.corrigido .badge-text{background-color:#85aed0;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.aberto .badge-text{background-color:#d08585;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado{float:left;width:100%}.list-card .list-card-details .badges .js-custom-field-badges .badge.validado .badge-text{background-color:#8cbd82;padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch{float:left;background-color:#d8884a;margin-left:2px;border-radius:2px}.list-card .list-card-details .badges .js-custom-field-badges .badge.branch .badge-text{padding:4px;border-radius:4px;text-shadow:#666 0 0 1px;color:#fff}.list-card .list-card-details .js-custom-field-badges .badge.team{float:right;margin-right:0}.list-card.team-01{box-shadow:0 -3px 0 #ab7dab;margin-bottom:6px;margin-top:9px}.list-card.team-01:first-child{margin-top:3px}.list-card.team-01 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#ab7dab;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.team-01 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.team-01 .list-card-members .member{border:2px solid #ab7dab}.list-card.team-02{box-shadow:0 -3px 0 #5d9e9e;margin-bottom:6px;margin-top:9px}.list-card.team-02:first-child{margin-top:3px}.list-card.team-02 .list-card-details .badges .js-custom-field-badges .badge.team{background-color:#5d9e9e;border-radius:3px;padding-left:4px;padding-right:4px}.list-card.team-02 .list-card-details .badges .js-custom-field-badges .badge-text{color:#fff;font-weight:800}.list-card.team-02 .list-card-members .member{border:2px solid #5d9e9e}.window-cover-stickers{position:relative;left:0;right:0;border:0;top:0}.window-cover-stickers .sticker{left:0!important;top:0!important;position:relative}.window-cover-stickers .sticker img{opacity:.6;transform:rotate(0deg)!important}.window-cover-stickers-only{position:absolute;background:transparent;box-shadow:none;bottom:0;right:0;width:auto;height:auto}.card-label.mod-card-detail{font-size:11pt}.list-header-num-cards.hide{display:inline-block!important}', "" ]);
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