package world.betterserver.server.controller.mcStat;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;
import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.service.mcStats.McStatsService;
import world.betterserver.server.service.mcUUID.UUIDTranslatorService;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class McStatController implements McStatControllerTemplate {

    private final McStatsService statsService;
    private final UUIDTranslatorService translator;

    @Override
    public Set<McPlayer> getAllPlayers() {
        return this.statsService.getAllPlayersWithStats().stream()
                .map(this.translator::findPlayer)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<StatSummary> getStatsFor(UUID UUID) {
        return this.statsService.getAllStatsFor(UUID).stream()
                .map(this::summarise)
                .collect(Collectors.toSet());
    }

    @Override
    public Map<UUID, Set<StatSummary>> getAllStats() {
        return this.statsService.getAllStats().entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .map(this::summarise)
                                .collect(Collectors.toSet())
                        )
                );
    }

    private StatSummary summarise(@NonNull McPlayerStat bigStat) {
        return new StatSummary(
                bigStat.getPlayerUuid(),
                bigStat.getStatKey(),
                bigStat.getStatValue(),
                bigStat.getUpdatedAt()
        );
    }
}
