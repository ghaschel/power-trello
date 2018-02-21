import { dictionary, settings, mutationObserverConfig } from "util/interfaces";
let css = require('./util/style.ts');

class PowerTrello {
    dic: dictionary;
    settings: settings;

    target: Node | null;
    windowTarget: Node | null;
    windowRecursiveTarget: Node | null;

    config: mutationObserverConfig;
    configWindow: mutationObserverConfig;
    configWindowRecursive: mutationObserverConfig;

    body: MutationObserver;
    windowDiv: MutationObserver;
    windowRecursiveDiv: MutationObserver;

    constructor() {
        css.default.applyStyles();

        this.settings = {
            refreshTime: 1
        };

        this.dic = {
            team1: 'pgd-01',
            team2: 'pgd-02',
            teamTitle: 'time',
            bug: 'bug',
            open: 'aberto',
            fixed: 'corrigido',
            validated: 'validado',
            branch: 'branch'
        };

        this.config = {
            attributes: true,
            childList: true,
            characterData: false,
            attributeOldValue: true,
            attributeFilter : ['class']
        };

        this.configWindow = {
            attributes: true,
            childList: true,
            characterData: false,
            attributeOldValue: true,
            attributeFilter: ['style']
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

    // board

    private addBugIcon(): void {
        let dic = this.dic;
        let $labelsWithoutRed = $('.list-card');
        let $labels = $('.list-card .card-label.card-label-red');

        $labelsWithoutRed.each(function(){
            $(this).removeClass('has-bug');
        });

        $labels.each(function(){
            if ($(this)[0].innerText.toLowerCase() == dic.bug) {
                $(this).parent().parent().parent().addClass('has-bug');
            }
        });
    };

    private addTeamClasses(): void {
        let dic = this.dic;

        $('.list-card').each(function(){
            $(this).removeClass(dic.team1);
            $(this).removeClass(dic.team2);
        });

        $('.team').each(function(){
            $(this).removeClass('team');
        });

        $('.list-card .list-card-details .js-plugin-badges .badge-text').each(function(){
            let $parent = $(this).parent();
            let $grandParent = $parent.parent().parent().parent().parent().parent();
            let $innerText = $(this)[0].innerText.toLowerCase();

            $parent.removeClass(dic.open)
                   .removeClass(dic.validated)
                   .removeClass(dic.fixed)
                   .removeClass(dic.teamTitle)
                   .removeClass(dic.branch);

            if ($innerText.indexOf(dic.team1) > -1) {
                $parent.addClass('team');
                $grandParent.addClass(dic.team1);
            }
            if ($innerText.indexOf(dic.team2) > -1) {
                $parent.addClass('team');
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
    };

    //window functions

    private addWindowTeamClasses(team: any): void {
        this.removeWindowTeamClasses();
        $('.window').addClass(team.toLowerCase());
    };

    private removeWindowTeamClasses(): void {
        let $window = $('.window');

        $window.removeClass(this.dic.team1);
        $window.removeClass(this.dic.team2);
    };

    private removeBadgeClasses(): void {
        let dic = this.dic;

        $('.window .js-plugin-badges .card-detail-item').each(function(){
            $(this).removeClass(dic.open)
                   .removeClass(dic.validated)
                   .removeClass(dic.fixed)
                   .removeClass(dic.teamTitle)
                   .removeClass(dic.branch);
        });
    };

    private addBadgeClasses(): void {
        let that = this;
        let dic = this.dic;
        this.removeBadgeClasses();

        $('.window .js-plugin-badges .card-detail-item').each(function(){
            let $innerText0 = $(this).children()[0].innerText.toLowerCase();
            let $innerText1 = $(this).children()[1].innerText;

            if($innerText0.indexOf(dic.open) > -1) {
                $(this).addClass(dic.open);
            }
            if($innerText0.indexOf(dic.validated) > -1) {
                $(this).addClass(dic.validated);
            }
            if($innerText0.indexOf(dic.fixed) > -1) {
                $(this).addClass(dic.fixed);
            }
            if($innerText0.indexOf(dic.branch) > -1) {
                $(this).addClass(dic.branch);
            }
            if($innerText0.indexOf(dic.teamTitle) > -1) {
                $(this).addClass(dic.teamTitle);

                if($innerText1.indexOf(dic.team1) > -1) {
                    that.addWindowTeamClasses(dic.team1);
                } else if ($innerText1.indexOf(dic.team2) > -1) {
                    that.addWindowTeamClasses(dic.team2);
                }
            }
        });
    };

    private addBugClassToWindow(): void {
        let dic = this.dic;
        let $labels = $('.window .card-label.card-label-red');
        let $window = $('.window');
        let count = 0;

        $labels.each(function(){
            count = ($(this)[0].innerText.toLowerCase() == dic.bug) ? (count + 1) : count;
        });
        $window.removeClass('has-bug');

        if ($labels.length > 0 && count > 0) {
            $window.addClass('has-bug');
        }
    };

    //status change

    private isQuickEditRemoved(removedNodes: any): boolean {
        return removedNodes.className == 'quick-card-editor';
    };

    private isWindowUp(mutation: any): boolean {
        let oldV = mutation.oldValue;
        let newV = mutation.target.className;
        let isWindowUp = false;

        if (oldV !== null && newV !== null) {
            isWindowUp = (oldV.indexOf('window-up') > -1 && newV.indexOf('window-up') === -1) ? true : false;
        }

        return isWindowUp;
    };

    private isWindowOpen(mutation: any): boolean {
        return (mutation.oldValue == 'display: none;' || mutation.oldValue === null);
    };

    private isWindowClosed(mutation: any): boolean {
        return mutation.oldValue == 'display: block;';
    };

    private isBadgeAdded(mutations: any): boolean {
        let that = this;

        let a = mutations.some((el: any) => {
            let r = false;

            if (el.target.className === 'js-plugin-badges' ||
                el.previousSibling && el.previousSibling.className && el.previousSibling.className.indexOf('card-detail-item') ||
                el.target.firstChild && el.target.firstChild.className && el.target.firstChild.className.indexOf('card-detail-item') > -1 ||
                el.target.className && el.target.className.indexOf('card-detail-item') > -1
               ) {
                that.addBadgeClasses();
                r = true;
            }

            return el.type == 'childList' && r;
        });

        return a;
    };

    private isBadgeRemoved(mutations: any): boolean {
        let that = this;
        let dic = this.dic;

        let a = mutations.some((el: any) => {
            let r = false;

            for (var property in el.removedNodes) {
                if (el.removedNodes[property].innerText && (el.removedNodes[property].innerText.toLowerCase().indexOf(dic.team1) > -1 || el.removedNodes[property].innerText.toLowerCase().indexOf(dic.team2) > -1)) {
                    r = true;
                    that.removeWindowTeamClasses();
                    break;
                }
            }

            return el.type == 'childList' && r;
        });

        return a;
    };

    private wereLabelsAdded(mutations: any): boolean {
        let a = mutations.some((el: any): boolean => {
            let r = false;

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

    private wereLabelsRemoved(mutations: any): boolean {
        let a = mutations.some((el: any) => {
            let r = false;

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

    private readyEvents(): void {
        $(document).ready(($) => {
            this.target = document.querySelector("body");
            this.windowTarget = document.querySelector(".window");
            this.windowRecursiveTarget = document.querySelector(".window");

            this.body = new MutationObserver((mutations: any): void => {
                if (mutations.length > 0) {
                    if (
                        (mutations[0].attributeName === 'class' && this.isWindowUp(mutations[0])) ||
                        (mutations[0].removedNodes.length > 0 && this.isQuickEditRemoved(mutations[0].removedNodes[0]))
                    ) {
                        this.addBugIcon();
                    }
                }
            });

            this.windowDiv = new MutationObserver((mutations: any): void => {
                if (mutations.length > 0) {
                    if(mutations[0].attributeName === 'style' && this.isWindowOpen(mutations[0])) {
                        this.addBugClassToWindow();
                    }
                    if(mutations[0].attributeName === 'style' && this.isWindowClosed(mutations[0])) {
                        this.addBugIcon();
                        this.addTeamClasses();
                    }
                }
            });

            this.windowRecursiveDiv = new MutationObserver((mutations: any): void => {
                if (mutations.length > 0) {
                    if (
                        this.wereLabelsAdded(mutations) ||
                        this.wereLabelsRemoved(mutations)
                    ) {
                        this.addBugClassToWindow();
                    }
                    if (
                        this.isBadgeAdded(mutations) ||
                        this.isBadgeRemoved(mutations)
                    ) {
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

    private loadEvents(): void {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.addTeamClasses();
            }, 600);
    
            setInterval(() => {
                this.addTeamClasses();
                this.addBugIcon();
            }, ((1000 * 60) * this.settings.refreshTime));
        });
   
    }
}

new PowerTrello();