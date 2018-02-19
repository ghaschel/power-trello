export interface dictionary {
        team1: string,
        team2: string,
        teamTitle: string,
        bug: string,
        open: string,
        fixed: string,
        validated: string,
        branch: string
};

export interface settings {
    refreshTime: number
};
    
export interface mutationObserverConfig {
    attributes: boolean;
    childList: boolean;
    characterData: boolean;
    attributeOldValue: boolean;
    attributeFilter?: any[];
    subtree?: boolean;
}