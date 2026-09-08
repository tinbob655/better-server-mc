package world.betterserver.server.service.mcStats;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStatRepository;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
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
}
