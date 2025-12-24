export interface statusObj {
    version: {
        name: string,
        protocol: string,
    },
    players: {
        online: number,
        max: number,
        sample: string[],
    },
    motd: {
        raw: string,
        clean: string,
        html: string,
    },
    favicon: string,
    srvRecord: {
        host: string,
        port: number,
    },
    roundTripLatency: number,
}