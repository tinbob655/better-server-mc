//custom stats that are stored as tick counts rather than plain numbers
const TICK_BASED_STATS = new Set(['play_time', 'total_world_time', 'time_since_death', 'time_since_rest', 'sneak_time']);

//'minecraft:custom:minecraft:play_time' -> {category: 'custom', name: 'play_time'}
export function parseStatKey(statKey: string): { category: string; name: string } {
    const parts = statKey.split(':');
    return {
        category: parts[1] ?? parts[0],
        name: parts[parts.length - 1],
    };
}

//'play_time' -> 'Play time'
export function toReadableLabel(rawName: string): string {
    const spaced = rawName.replace(/_/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatTicksAsDuration(ticks: number): string {
    const totalSeconds = Math.floor(ticks / 20); //20 ticks per second

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

export function formatCentimetres(cm: number): string {
    const metres = cm / 100;
    return metres >= 1000 ? `${(metres / 1000).toFixed(1)}km` : `${Math.round(metres)}m`;
}

//picks a unit/format based on the raw (un-prettified) stat name
export function formatStatValue(rawName: string, value: number): string {
    if (TICK_BASED_STATS.has(rawName)) return formatTicksAsDuration(value);
    if (rawName.endsWith('_one_cm')) return formatCentimetres(value);
    return value.toLocaleString();
}