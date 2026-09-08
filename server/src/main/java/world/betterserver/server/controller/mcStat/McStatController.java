package world.betterserver.server.controller.mcStat;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;
import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.service.mcStats.McStatsService;
import world.betterserver.server.service.mcUUID.UUIDTranslatorService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class McStatController implements McStatControllerTemplate {

    private final McStatsService statsService;
    private final UUIDTranslatorService translator;

    @Override
    public List<McPlayer> getAllPlayers() {
        return this.statsService.getAllPlayersWithStats().stream()
                .map(this.translator::findPlayer)
                .sorted(Comparator.comparing(McPlayer::username))
                .toList();
    }

    @Override
    public List<StatSummary> getStatsFor(UUID UUID) {
        return this.statsService.getAllStatsFor(UUID).stream()
                .map(this::summarise)
                .sorted(Comparator.comparing(StatSummary::statKey))
                .toList();
    }

    @Override
    public Map<UUID, List<StatSummary>> getAllStats() {
        return this.statsService.getAllStats().entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .map(this::summarise)
                                .sorted(Comparator.comparing(StatSummary::statKey))
                                .toList()
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
