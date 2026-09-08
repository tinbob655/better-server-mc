import React, {useState, useEffect, useMemo} from 'react';
import type {McPlayer, McPlayerStat} from "../../../types/player";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";
import './singlePlayer.scss'

interface SinglePlayerParams {
    player: McPlayer;
    getStats: () => Promise<McPlayerStat[]>
}

//friendlier headings for the raw vanilla stat categories
const CATEGORY_LABELS: Record<string, string> = {
    custom: 'General',
    mined: 'Blocks mined',
    crafted: 'Items crafted',
    used: 'Items used',
    broken: 'Items broken',
    picked_up: 'Items picked up',
    dropped: 'Items dropped',
    killed: 'Mobs killed',
    killed_by: 'Deaths to',
};

//custom stats that are stored as tick counts rather than plain numbers
const TICK_BASED_STATS = new Set(['play_time', 'total_world_time', 'time_since_death', 'time_since_rest', 'sneak_time']);

//'minecraft:custom:minecraft:play_time' -> {category: 'custom', name: 'play_time'}
function parseStatKey(statKey: string): { category: string; name: string } {
    const parts = statKey.split(':');
    return {
        category: parts[1] ?? parts[0],
        name: parts[parts.length - 1],
    };
}

//'play_time' -> 'Play time'
function toReadableLabel(rawName: string): string {
    const spaced = rawName.replace(/_/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatTicksAsDuration(ticks: number): string {
    const totalSeconds = Math.floor(ticks / 20); //20 ticks per second

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function formatCentimetres(cm: number): string {
    const metres = cm / 100;
    return metres >= 1000 ? `${(metres / 1000).toFixed(1)}km` : `${Math.round(metres)}m`;
}

//picks a unit/format based on the raw (un-prettified) stat name
function formatStatValue(rawName: string, value: number): string {
    if (TICK_BASED_STATS.has(rawName)) return formatTicksAsDuration(value);
    if (rawName.endsWith('_one_cm')) return formatCentimetres(value);
    return value.toLocaleString();
}

interface DisplayStat {
    key: string;
    label: string;
    value: string;
}

interface StatGroup {
    category: string;
    stats: DisplayStat[];
}

//turns the raw API response into sorted, labelled groups ready to render
function groupStats(rawStats: McPlayerStat[]): StatGroup[] {
    const groups = new Map<string, DisplayStat[]>();

    for (const stat of rawStats) {
        const {category, name} = parseStatKey(stat.statKey);
        const displayStat: DisplayStat = {
            key: stat.statKey,
            label: toReadableLabel(name),
            value: formatStatValue(name, stat.statValue),
        };
        groups.set(category, [...(groups.get(category) ?? []), displayStat]);
    }

    return Array.from(groups.entries())
        .map(([category, stats]) => ({
            category: CATEGORY_LABELS[category] ?? toReadableLabel(category),
            stats: stats.sort((a, b) => a.label.localeCompare(b.label)),
        }))
        .sort((a, b) => a.category.localeCompare(b.category));
}

export default function SinglePlayer({player, getStats}: SinglePlayerParams): React.ReactElement {

    const [expanded, setExpanded] = useState<boolean>(false);
    const [stats, setStats] = useState<McPlayerStat[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [filter, setFilter] = useState<string>('');

    //fetch stats the first time this player is expanded
    useEffect(() => {
        if (!expanded || stats !== null || loading) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        getStats()
            .then(setStats)
            .catch(err => setError(parseAxiosError(err)))
            .finally(() => setLoading(false));
    }, [expanded, stats, loading, getStats]);

    const groupedStats = useMemo(() => stats ? groupStats(stats) : [], [stats]);

    //re-filters groups as the user types, dropping any group left with no matches
    const visibleGroups = useMemo(() => {
        const search = filter.trim().toLowerCase();
        if (!search) return groupedStats;

        return groupedStats
            .map(group => ({...group, stats: group.stats.filter(s => s.label.toLowerCase().includes(search))}))
            .filter(group => group.stats.length > 0);
    }, [groupedStats, filter]);

    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

    function toggleCategory(category: string): void {
        setCollapsedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    }

    return (
        <div className={`widget singlePlayerWrapper ${expanded ? "expanded" : ""}`}>

            {/*title rows expands the widget on click*/}
            <button
                onClick={() => setExpanded(prev => !prev)}
                className={"expandButton noVerticalSpacing"}
                aria-expanded={expanded}
            >
                <span className={"singlePlayerIdentity"}>
                    <img
                        src={`https://mc-heads.net/avatar/${player.uuid}/36`}   //this is an api which fetches a player head
                        alt={""}
                        className={"singlePlayerAvatar"}
                        onError={e => { e.currentTarget.style.visibility = 'hidden'; }}
                    />
                    <h2 className={"noVerticalSpacing"}>
                        {player.username}
                    </h2>
                </span>
                <span className={"expandChevron"}>▸</span>
            </button>

            {/*detailed breakdown of player stats*/}
            <div className={`singlePlayerStatsCollapse ${expanded ? "expanded" : ""}`}>
                <div className={"singlePlayerStatsInner"}>

                    {loading && <p className={"warningText smaller"}>Loading stats...</p>}
                    {error && <p className={"errorText smaller"}>{error}</p>}

                    {!loading && !error && stats?.length === 0 && (
                        <p className={"smaller"}>No stats recorded for this player yet.</p>
                    )}

                    {!loading && !error && stats && stats.length > 0 && (
                        <React.Fragment>
                            <input
                                type={"text"}
                                placeholder={"Filter stats..."}
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                className={"singlePlayerStatFilter"}
                            />

                            {visibleGroups.length === 0 && (
                                <p className={"smaller"}>No stats match "{filter}".</p>
                            )}

                            {visibleGroups.map(group => {
                                //while actively filtering, force every matching group open regardless of its collapsed state
                                const isCollapsed: boolean = filter.trim().length === 0 && collapsedCategories.has(group.category);

                                return (
                                    <div key={group.category} className={"singlePlayerStatGroup"}>
                                        <button
                                            type={"button"}
                                            className={"singlePlayerStatCategoryButton"}
                                            onClick={() => toggleCategory(group.category)}
                                            aria-expanded={!isCollapsed}
                                        >
                                            <span className={`expandChevron categoryChevron ${isCollapsed ? "" : "rotated"}`}>▸</span>
                                            <h3 className={"singlePlayerStatCategory noVerticalSpacing"}>{group.category}</h3>
                                            <span className={"singlePlayerStatCount"}>{group.stats.length}</span>
                                        </button>

                                        <div className={`singlePlayerCategoryCollapse ${isCollapsed ? "" : "expanded"}`}>
                                            <div className={"singlePlayerCategoryInner"}>
                                                <div className={"singlePlayerStatGrid"}>
                                                    {group.stats.map(stat => (
                                                        <div key={stat.key} className={"singlePlayerStatCard"}>
                                                            <span className={"singlePlayerStatLabel"}>{stat.label}</span>
                                                            <span className={"singlePlayerStatValue"}>{stat.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    )
}