package world.betterserver.server.service.mcStats;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStatRepository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class McStatsServiceImpl implements McStatsService {

    private final McPlayerStatRepository statRepository;

    @Override
    public Set<McPlayerStat> getAllStatsFor(@NonNull UUID playerUuid) {
        return this.statRepository.findAllByPlayerUuid(playerUuid);
    }

    @Override
    public Set<UUID> getAllPlayersWithStats() {
        return this.statRepository.findAllPlayerUuids();
    }

    @Override
    public Map<UUID, Set<McPlayerStat>> getAllStats() {
        return this.statRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        McPlayerStat::getPlayerUuid,
                        Collectors.toSet()
                ));
    }

    @Override
    public List<McPlayerStat> getAllStatsNamed(String statKey) {
        return this.statRepository.findAllByStatKeyOrderByStatValueDesc(statKey);
    }

    @Override
    public List<McPlayerStat> getAllStatsNamed(List<String> statKeys) {
        if (statKeys.size() == 1) return this.getAllStatsNamed(statKeys.getFirst());

        return this.statRepository.findAllByStatKeyIn(statKeys).stream()
                .collect(Collectors.groupingBy(McPlayerStat::getPlayerUuid))
                .values().stream()
                .map(this::mergeVariantStats)
                .sorted(Comparator.comparingLong(McPlayerStat::getStatValue).reversed())
                .toList();
    }

    @Override
    public List<McPlayerStat> getAllStatsByCategory(String category) {
        String prefix = "minecraft:" + category + ':';

        return this.statRepository.findTotalsByCategoryPrefix(prefix).stream()
                .map(row -> {
                    McPlayerStat merged = new McPlayerStat();
                    merged.setPlayerUuid(row.getPlayerUuid());
                    merged.setStatKey("category:" + category);
                    merged.setStatValue(row.getTotal() != null ? row.getTotal() : 0L);
                    merged.setUpdatedAt(row.getUpdatedAt());
                    return merged;
                })
                .toList();
    }


    private McPlayerStat mergeVariantStats(List<McPlayerStat> statsForPlayer) {
        McPlayerStat merged = new McPlayerStat();
        merged.setPlayerUuid(statsForPlayer.getFirst().getPlayerUuid());
        merged.setStatKey(statsForPlayer.stream().map(McPlayerStat::getStatKey).collect(Collectors.joining(",")));
        merged.setStatValue(statsForPlayer.stream().mapToLong(McPlayerStat::getStatValue).sum());
        merged.setUpdatedAt(statsForPlayer.stream().map(McPlayerStat::getUpdatedAt).max(Instant::compareTo).orElseThrow());
        return merged;
    }
}
