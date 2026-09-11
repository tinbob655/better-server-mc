//custom stats that are stored as tick counts rather than plain numbers
const TICK_BASED_STATS = new Set(['play_time', 'total_world_time', 'time_since_death', 'time_since_rest', 'sneak_time']);

//tells the backend to summ an entire stat category or not
const CATEGORY_STAT_PREFIX: string = 'category:';

export const BLOCKS_BROKEN_STAT_KEY = `${CATEGORY_STAT_PREFIX}mined`;
export const THINGS_USED_STAT_KEY = `${CATEGORY_STAT_PREFIX}used`;

//manually rename some stats
const STAT_NAME_OVERRIDES: Record<string, string> = {
    walk_one_cm: 'Distance walked',
    fly_one_cm: 'Distance flown',
}

//list of all stats related to mining ore
export const TOTAL_ORE_STAT_KEYS: string[] = [
    'minecraft:mined:minecraft:coal_ore',
    'minecraft:mined:minecraft:deepslate_coal_ore',
    'minecraft:mined:minecraft:iron_ore',
    'minecraft:mined:minecraft:deepslate_iron_ore',
    'minecraft:mined:minecraft:copper_ore',
    'minecraft:mined:minecraft:deepslate_copper_ore',
    'minecraft:mined:minecraft:gold_ore',
    'minecraft:mined:minecraft:deepslate_gold_ore',
    'minecraft:mined:minecraft:redstone_ore',
    'minecraft:mined:minecraft:deepslate_redstone_ore',
    'minecraft:mined:minecraft:lapis_ore',
    'minecraft:mined:minecraft:deepslate_lapis_ore',
    'minecraft:mined:minecraft:diamond_ore',
    'minecraft:mined:minecraft:deepslate_diamond_ore',
    'minecraft:mined:minecraft:emerald_ore',
    'minecraft:mined:minecraft:deepslate_emerald_ore',

    //nether ores
    'minecraft:mined:minecraft:nether_quartz_ore',
    'minecraft:mined:minecraft:nether_gold_ore',
    'minecraft:mined:minecraft:ancient_debris',
];
export const TOTAL_ORE_STAT_KEY: string = TOTAL_ORE_STAT_KEYS.join(',');

//'minecraft:custom:minecraft:play_time' -> {category: 'custom', name: 'play_time'}
export function parseStatKey(statKey: string): { category: string; name: string } {
    const [firstKey] = statKey.split(',');
    const parts = firstKey.split(':');
    return {
        category: parts[1] ?? parts[0],
        name: parts[parts.length - 1],
    };
}

//'play_time' -> 'Play time'
export function toReadableLabel(rawName: string): string {
    const override: string | undefined = STAT_NAME_OVERRIDES[rawName];
    if (override) return override;

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