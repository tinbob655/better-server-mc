package world.betterserver.server.service.mcStats;

import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface McStatsService {
    Set<McPlayerStat> getAllStatsFor(UUID playerUuid);
    Set<UUID> getAllPlayersWithStats();
    Map<UUID, Set<McPlayerStat>> getAllStats();
    List<McPlayerStat> getAllStatsNamed(String statKey);
}
