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
// @name         TrelloTagName
// @version      0.7.8
// @description  Adiciona o nome da tag dentro da etiqueta de cor.
// @author       Guilherme Haschel
// @icon         https://bytebucket.org/echo__off/trellocustomcolors/raw/master/icon-48.png
// @icon64       https://bytebucket.org/echo__off/trellocustomcolors/raw/master/icon-64.png
// @domain       trello.com
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @match        https://trello.com/b/*
// @match        https://trello.com/c/*
// @updateURL    https://bitbucket.org/echo__off/trellocustomcolors/raw/master/userscript.js
// @downloadURL  https://bitbucket.org/echo__off/trellocustomcolors/raw/master/userscript.js
// @license      MIT
// ==/UserScript==
(function() {
    'use strict';

    var colors = {
        team1: '#ab7dab',
        team2: '#5d9e9e',
        noTeam: '#a6a6a6',
        open: '#d08585',
        fixed: '#85aed0',
        validated: '#8cbd82',
        branch: '#d8884a'
    };

    var text = {
        team1: 'PGD-01',
        team2: 'PGD-02',
        teamTitle: 'TIME',
        bug: 'BUG',
        open: 'ABERTO',
        fixed: 'CORRIGIDO',
        validated: 'VALIDADO',
        branch: 'BRANCH'
    };

    var textLC = {
        team1: text.team1.toLowerCase(),
        team2: text.team2.toLowerCase(),
        teamTitle: text.teamTitle.toLowerCase(),
        bug: text.bug.toLowerCase(),
        open: text.open.toLowerCase(),
        fixed: text.fixed.toLowerCase(),
        validated: text.validated.toLowerCase(),
        branch: text.branch.toLowerCase(),
    };

    var settings = {
        // minutos para o refresh dos estilos
        // minutes for the style refresh
        // minuten voor de stijlen verniuweren
        refreshTime: 1
    };

    var img = {
        small: 'https://bytebucket.org/echo__off/trellocustomcolors/raw/master/assets/icon-small.png',
        big: 'https://bitbucket.org/echo__off/trellocustomcolors/raw/master/assets/icon-big.png'
    };

    var sheet = (function() {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style.sheet;
    })();

    sheet.insertRule(".list-card .list-card-labels .card-label { height: auto; line-height: 100%; width: auto; text-shadow: 0px 0px 1px #666; padding: 5px 6px; font-size: 11pt; width: auto; max-width: none; min-width: auto; pointer-events: none; }", sheet.cssRules.length);
    sheet.insertRule(".list-card.has-bug { background-size: 48px; background-position: 106% -6px; background-repeat: no-repeat; background-image: url('" + img.small + "'); }", sheet.cssRules.length);
    sheet.insertRule(".window.has-bug {background-image: url('" + img.big + "'); background-repeat: no-repeat; background-size: 150px; background-position: 105% -20px; }", sheet.cssRules.length);
    sheet.insertRule(".window.has-bug .window-header .window-title textarea, .window .window-sidebar .window-module h3 { text-shadow: #EDEFF0 1px 0px 0px, #EDEFF0 -1px 0px 0px, #EDEFF0 0px 1px 0px, #EDEFF0 0px -1px 0px; }", sheet.cssRules.length);
    sheet.insertRule(".window .card-detail-badge.is-clickable { text-decoration: none; }", sheet.cssRules.length);
    sheet.insertRule(".window." + textLC.team1 + " .js-plugin-badges .card-detail-item." + textLC.teamTitle + " .card-detail-badge:hover { opacity: .75; }", sheet.cssRules.length);
    sheet.insertRule(".window." + textLC.team1 + " .js-plugin-badges .card-detail-item." + textLC.teamTitle + " .card-detail-badge { background-color: " + colors.team1 + "; color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".window." + textLC.team2 + " .js-plugin-badges .card-detail-item." + textLC.teamTitle + " .card-detail-badge:hover { opacity: .75; }", sheet.cssRules.length);
    sheet.insertRule(".window." + textLC.team2 + " .js-plugin-badges .card-detail-item." + textLC.teamTitle + " .card-detail-badge { background-color: " + colors.team2 + "; color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.fixed + " .card-detail-badge:hover { opacity: .75; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.fixed + " .card-detail-badge { text-align: center; background-color: " + colors.fixed + "; color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.open + " .card-detail-badge:hover { opacity: .75; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.open + " .card-detail-badge { text-align: center; background-color: " + colors.open + "; color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.validated + " .card-detail-badge:hover { opacity: .75; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.validated + " .card-detail-badge { text-align: center; background-color: " + colors.validated + "; color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.branch + " .card-detail-badge:hover { opacity: .75; }", sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges .card-detail-item." + textLC.branch + " .card-detail-badge { text-align: center; background-color: " + colors.branch + "; color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule('.window .js-plugin-badges .card-detail-item { margin-right: 20px !important; }', sheet.cssRules.length);
    sheet.insertRule('.window .js-plugin-badges .card-detail-item:last-of-type { margin-right: 0px !important; }', sheet.cssRules.length);
    sheet.insertRule(".window .js-plugin-badges { width: 100%; float: left; }", sheet.cssRules.length);
    sheet.insertRule(".window { box-shadow: 0px -5px 0px " + colors.noTeam + "; }", sheet.cssRules.length);
    sheet.insertRule(".window." + textLC.team1 + " { box-shadow: 0px -5px 0px " + colors.team1 + "; }", sheet.cssRules.length);
    sheet.insertRule(".window." + textLC.team2 + " { box-shadow: 0px -5px 0px " + colors.team2 + "; }", sheet.cssRules.length);
    sheet.insertRule(".window-cover-stickers .sticker img { opacity: 0.6; transform: rotate(0deg) !important; }", sheet.cssRules.length);
    sheet.insertRule(".window-cover-stickers .sticker { left: 0 !important; top: 0 !important; position: relative; }", sheet.cssRules.length);
    sheet.insertRule(".window-cover-stickers { position: relative; left: 0; right: 0; border: 0; top: 0;}", sheet.cssRules.length);
    sheet.insertRule(".window-cover-stickers-only { position: absolute; background: transparent; box-shadow: none; bottom: 0; right: 0; width: auto; height: auto; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges { width: 100%; margin-top: 5px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card a { margin-top: 8px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge.team { float: right; margin-right: 0px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card.placeholder { padding-top: 2px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card:not(.placeholder) { box-shadow: 0px -3px 0px " + colors.noTeam + "; margin-bottom: 6px; margin-top: 9px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team1 + " { box-shadow: 0px -3px 0px " + colors.team1 + "; margin-bottom: 6px; margin-top: 9px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team1 + ":first-child { margin-top: 3px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team2 + ":first-child { margin-top: 3px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team2 + " { box-shadow: 0px -3px 0px " + colors.team2 + "; margin-bottom: 6px; margin-top: 9px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team1 + " .list-card-details .badges .js-plugin-badges .badge.team { background-color: " + colors.team1 + "; border-radius: 3px; padding-left: 4px; padding-right: 4px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team2 + " .list-card-details .badges .js-plugin-badges .badge.team { background-color: " + colors.team2 + "; border-radius: 3px; padding-left: 4px; padding-right: 4px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team1 + " .list-card-details .badges .js-plugin-badges .badge-text { color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team2 + " .list-card-details .badges .js-plugin-badges .badge-text { color: #fff; font-weight: 800; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.open + " .badge-text, .list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.fixed + " .badge-text, .list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.validated + " .badge-text, .list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.branch + " .badge-text { padding: 4px; border-radius: 4px; text-shadow: rgb(102, 102, 102) 0px 0px 1px; color: #fff; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.open + ", .list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.fixed + ", .list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.validated + " { float: left; width: 100%; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.open + " .badge-text { background-color: " + colors.open + "; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.fixed + " .badge-text { background-color: " + colors.fixed + "; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.validated + " .badge-text { background-color: " + colors.validated + "; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-details .badges .js-plugin-badges .badge." + textLC.branch + " { margin-left: 2px; border-radius: 2px; background-color: " + colors.branch + "; float: left; }", sheet.cssRules.length);
    sheet.insertRule(".list-card .list-card-members .member { border-radius: 50%; border: 2px solid " + colors.noTeam + "; }", sheet.cssRules.length);
    sheet.insertRule(".list-card.active-card.is-stickered .list-card-details, .list-card.is-stickered .list-card-details { background-color: unset; }", sheet.cssRules.length);
    sheet.insertRule(".list-card.is-stickered .list-card-details { margin-top: unset; }", sheet.cssRules.length);
    sheet.insertRule(".list-card.is-stickered .stickers { position: absolute; right: 0; top: 100%; transform: translateY(-100%); }", sheet.cssRules.length);
    sheet.insertRule(".list-card.is-stickered .stickers .sticker { top: 95% !important; left: 99% !important; transform: translateX(-100%) translateY(-100%); height: 32px; width: 32px; }", sheet.cssRules.length);
    sheet.insertRule(".list-card.is-stickered .stickers .sticker img { height: 100%; width: 100%; transform: rotate(0deg) !important; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team1 + " .list-card-members .member { border: 2px solid " + colors.team1 + "; }", sheet.cssRules.length);
    sheet.insertRule(".list-card." + textLC.team2 + " .list-card-members .member { border: 2px solid " + colors.team2 + "; }", sheet.cssRules.length);
    sheet.insertRule("body { background-position: 50% 50%; }", sheet.cssRules.length);
    sheet.insertRule(".card-label.mod-card-detail { font-size: 11pt; }", sheet.cssRules.length);
    sheet.insertRule(".list-header-num-cards.hide { display: inline-block !important; }", sheet.cssRules.length);

    var addWindowTeamClasses = function(team) {
        removeWindowTeamClasses();
        $('.window').addClass(team.toLowerCase());
    };

    var removeWindowTeamClasses = function() {
        var $window = $('.window');

        $window.removeClass(textLC.team1);
        $window.removeClass(textLC.team2);
    };

    var addTeamClasses = function() {
        $('.list-card').each(function(){
            $(this).removeClass(textLC.team1);
            $(this).removeClass(textLC.team2);
        });
        $('.team').each(function(){
            $(this).removeClass('team');
        });

        $('.list-card .list-card-details .js-plugin-badges .badge-text').each(function(){
            var $parent = $(this).parent();
            var $grandParent = $parent.parent().parent().parent().parent().parent();
            var $innerText = $(this)[0].innerText.toUpperCase();

            $parent.removeClass(textLC.open)
                   .removeClass(textLC.validated)
                   .removeClass(textLC.fixed)
                   .removeClass(textLC.teamTitle)
                   .removeClass(textLC.branch);

            if ($innerText.indexOf(text.team1) > -1) {
                $parent.addClass('team');
                $grandParent.addClass(textLC.team1);
            }
            if ($innerText.indexOf(text.team2) > -1) {
                $parent.addClass('team');
                $grandParent.addClass(textLC.team2);
            }
            if ($innerText.indexOf(text.open) > -1) {
                $parent.addClass(textLC.open);
            }
            if ($innerText.indexOf(text.fixed) > -1) {
                $parent.addClass(textLC.fixed);
            }
            if ($innerText.indexOf(text.validated) > -1) {
                $parent.addClass(textLC.validated);
            }
            if ($innerText.indexOf(text.branch) > -1) {
                $parent.addClass(textLC.branch);
            }
        });
    };

    var removeBadgeClasses = function() {
        $('.window .js-plugin-badges .card-detail-item').each(function(){
            $(this).removeClass(textLC.open)
                   .removeClass(textLC.validated)
                   .removeClass(textLC.fixed)
                   .removeClass(textLC.teamTitle)
                   .removeClass(textLC.branch);
        });
    };

    var addBadgeClasses = function() {
        removeBadgeClasses();
        $('.window .js-plugin-badges .card-detail-item').each(function(){
            var $innerText0 = $(this).children()[0].innerText.toUpperCase();
            var $innerText1 = $(this).children()[1].innerText;

            if($innerText0.indexOf(text.open) > -1) {
                $(this).addClass(textLC.open);
            }
            if($innerText0.indexOf(text.validated) > -1) {
                $(this).addClass(textLC.validated);
            }
            if($innerText0.indexOf(text.fixed) > -1) {
                $(this).addClass(textLC.fixed);
            }
            if($innerText0.indexOf(text.branch) > -1) {
                $(this).addClass(textLC.branch);
            }
            if($innerText0.indexOf(text.teamTitle) > -1) {
                $(this).addClass(textLC.teamTitle);

                if($innerText1.indexOf(text.team1) > -1) {
                    addWindowTeamClasses(text.team1);
                } else if ($innerText1.indexOf(text.team2) > -1) {
                    addWindowTeamClasses(text.team2);
                }
            }
        });
    };

    var addBugIcon = function() {
        var $labelsWithoutRed = $('.list-card');
        var $labels = $('.list-card .card-label.card-label-red');

        $labelsWithoutRed.each(function(){
            $(this).removeClass('has-bug');
        });

        $labels.each(function(){
            if ($(this)[0].innerText.toUpperCase() == text.bug) {
                $(this).parent().parent().parent().addClass('has-bug');
            }
        });
    };

    $(document).ready(function($){
        window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        var target = document.querySelector("body");
        var windowTarget = document.querySelector(".window");
        var windowRecursiveTarget = document.querySelector(".window");

        var config = { attributes: true, childList: true, characterData: false, attributeOldValue: true, attributeFilter : ['class'] };
        var configWindow = { attributes: true, childList: true, characterData: false, attributeOldValue: true, attributeFilter: ['style'] };
        var configWindowRecursive = { attributes: false, childList: true, characterData: false, attributeOldValue: false, subtree: true };

        var isWindowUp = function(mutation) {
            var oldV = mutation.oldValue;
            var newV = mutation.target.className;
            var isWindowUp = (oldV.indexOf('window-up') > -1 && newV.indexOf('window-up') === -1) ? true : false;

            return isWindowUp;
        };

        var isQuickEditRemoved = function(removedNodes) {
            return removedNodes.className == 'quick-card-editor';
        };

        var isWindowOpen = function(mutation) {
            return (mutation.oldValue == 'display: none;' || mutation.oldValue === null);
        };

        var isWindowClosed = function (mutation) {
            return mutation.oldValue == 'display: block;';
        };

        var addBugClassToWindow = function(){
            var $labels = $('.window .card-label.card-label-red');
            var $window = $('.window');
            var count = 0;

            $labels.each(function(){
                count = ($(this)[0].innerText.toUpperCase() == text.bug) ? (count + 1) : count;
            });
            $window.removeClass('has-bug');

            if ($labels.length > 0 && count > 0) {
                $window.addClass('has-bug');
            }
        };

        var body = new MutationObserver(function(mutations) {
            if (mutations.length > 0) {
                if (
                    (mutations[0].attributeName === 'class' && isWindowUp(mutations[0])) ||
                    (mutations[0].removedNodes.length > 0 && isQuickEditRemoved(mutations[0].removedNodes[0]))
                ) {
                    addBugIcon();
                }
            }
        });

        var isBadgeAdded = function(mutations) {
            var a = mutations.some(function(el){
                var r = false;

                if (el.target.className === 'js-plugin-badges' ||
                    el.previousSibling && el.previousSibling.className && el.previousSibling.className.indexOf('card-detail-item') ||
                    el.target.firstChild && el.target.firstChild.className && el.target.firstChild.className.indexOf('card-detail-item') > -1 ||
                    el.target.className && el.target.className.indexOf('card-detail-item') > -1
                   ) {
                    addBadgeClasses();
                    r = true;
                }

                return el.type == 'childList' && r;
            });

            return a;
        };

        var isBadgeRemoved = function(mutations) {
            var a = mutations.some(function(el){
                var r = false;

                for (var property in el.removedNodes) {
                    if (el.removedNodes[property].innerText && (el.removedNodes[property].innerText.toUpperCase().indexOf(text.team1) > -1 || el.removedNodes[property].innerText.toUpperCase().indexOf(text.team2) > -1)) {
                        r = true;
                        removeWindowTeamClasses();
                        break;
                    }
                }

                return el.type == 'childList' && r;
            });

            return a;
        };

        var wereLabelsAdded = function(mutations) {
            var a = mutations.some(function(el){
                var r = false;
                if (el.addedNodes.length > 0) {
                    for (var property in el.addedNodes) {
                        if (el.addedNodes.hasOwnProperty(property)) {
                            if (el.addedNodes[property].className && el.addedNodes[property].className.indexOf('card-label-red') > -1) {
                                r = true;
                                break;
                            }
                        }
                    }
                }
                return el.type == 'childList' && r;
            });
            return a;
        };

        var wereLabelsRemoved = function(mutations) {
            var a = mutations.some(function(el){
                var r = false;
                if (el.removedNodes.length > 0) {
                    for (var property in el.removedNodes) {
                        if (el.removedNodes.hasOwnProperty(property)) {
                            if (el.removedNodes[property].className && el.removedNodes[property].className.indexOf('card-label-red') > -1) {
                                r = true;
                                break;
                            }
                        }
                    }
                }
                return el.type == 'childList' && r;
            });
            return a;
        };

        var windowDiv = new MutationObserver(function(mutations) {
            if (mutations.length > 0) {
                if(mutations[0].attributeName === 'style' && isWindowOpen(mutations[0])) {
                    addBugClassToWindow();
                }
                if(mutations[0].attributeName === 'style' && isWindowClosed(mutations[0])) {
                    addBugIcon();
                    addTeamClasses();
                }
            }
        });

        var windowRecursiveDiv = new MutationObserver(function(mutations) {
            if (mutations.length > 0) {
                if (
                    wereLabelsAdded(mutations) ||
                    wereLabelsRemoved(mutations)
                ) {
                    addBugClassToWindow();
                }
                if (
                    isBadgeAdded(mutations) ||
                    isBadgeRemoved(mutations)
                ) {
                    addTeamClasses();
                }
            }
        });

        windowDiv.observe(windowTarget, configWindow);
        windowRecursiveDiv.observe(windowRecursiveTarget, configWindowRecursive);
        body.observe(target, config);
        addBugIcon();
    });

    $(window).load(function(){
        setTimeout(function(){
            addTeamClasses();
        }, 600);

        setInterval(function(){
            addTeamClasses();
            addBugIcon();
        }, ((1000 * 60) * settings.refreshTime));
    });

})();