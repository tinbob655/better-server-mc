export interface ServerStatusInfo {
    online: boolean;
    retrievedAt: number;
    icon: string;

    version: Version;
    players: Players;
    motd: Motd;
}

export interface Version {
    nameClean: string;
    protocol: number;
}

export interface Player {
    uuid: string;
    nameClean: string;
}

export interface Players {
    online: number;
    max: number;
    list: Player[];
}

export interface Motd {
    clean: string;
}