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

    body: MutationObserver | null;
    windowDiv: MutationObserver | null;
    windowRecursiveDiv: MutationObserver | null;

    constructor() {
        css.default.applyStyles();

        this.target = null;
        this.windowTarget = null;
        this.windowRecursiveTarget = null;
        this.body = null;
        this.windowDiv = null
        this.windowRecursiveDiv = null;

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

        $(".list-card .list-card-details .js-custom-field-badges .badge-text").each(function() {
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

        $('.window .js-custom-field-detail-badges .card-detail-item').each(function(){
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

        $('.window .js-custom-field-detail-badges .card-detail-item').each(function(){
            let $innerText0 = $(this).children()[0].innerText.toLowerCase();
            let $innerText1 = $(this).children()[1].innerText.toLowerCase();

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
        let oldV = mutation.oldValue || '';
        let newV = mutation.target.className || '';

        return oldV.indexOf('window-up') === -1 && newV.indexOf('window-up') > -1;
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
            let ps = el.previousSibling;
            let t = el.target;
            let fc = t.firstChild;

            if (el.target.className === 'js-plugin-badges' ||
                ps && ps.className && ps.className.indexOf('card-detail-item') > -1 ||
                fc && fc.className && fc.className.indexOf('card-detail-item') > -1 ||
                t.className && t.className.indexOf('card-detail-item') > -1
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
            let rn = el.removedNodes;

            for (var property in rn) {
                if (rn[property].innerText && (rn[property].innerText.toLowerCase().indexOf(dic.team1) > -1 || 
                    rn[property].innerText.toLowerCase().indexOf(dic.team2) > -1)
                ) {
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
            let an = el.addedNodes;

            if (an.length > 0) {
                for (var property in an) {
                    if (an.hasOwnProperty(property) &&
                        an[property].className &&
                        an[property].className.indexOf('card-label-red') > -1
                    ) {
                        r = true;
                        break;
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
            let rn = el.removedNodes;

            if (rn.length > 0) {
                for (var property in rn) {
                    if (rn.hasOwnProperty(property) &&
                        rn[property].className &&
                        rn[property].className.indexOf('card-label-red') > -1
                    ) {
                        r = true;
                        break;
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
                if (mutations.length === 0) return;

                let m = mutations[0];

                if (
                    (m.attributeName === 'class' && this.isWindowUp(m)) ||
                    (m.removedNodes.length > 0 && this.isQuickEditRemoved(m.removedNodes[0]))
                ) {
                    this.addBugIcon();
                    this.addBadgeClasses();
                    this.addTeamClasses();
                }
            });

            this.windowDiv = new MutationObserver((mutations: any): void => {
                if (mutations.length === 0) return;

                let m = mutations[0];

                console.log('windowDiv');
                console.log('isWindowOpen', this.isWindowOpen(m));
                console.log('isWindowClosed', this.isWindowClosed(m))
                
                if(m.attributeName === 'style' && this.isWindowOpen(m)) {
                    this.addBugClassToWindow();
                }

                if(m.attributeName === 'style' && this.isWindowClosed(m)) {
                    this.addBugIcon();
                    this.addTeamClasses();
                }
            });

            this.windowRecursiveDiv = new MutationObserver((mutations: any): void => {
                if (mutations.length === 0) return;

                console.log('windowRecursive');
                console.log('wereLabelsAdded', this.wereLabelsAdded(mutations));
                console.log('wereLabelsRemoved', this.wereLabelsRemoved(mutations));
                console.log('isBadgeAdded', this.isBadgeAdded(mutations));
                console.log('isBadgeremoved', this.isBadgeRemoved(mutations));

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