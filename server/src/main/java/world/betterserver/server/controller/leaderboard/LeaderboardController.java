package world.betterserver.server.controller.leaderboard;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.leaderboard.MultipleLeaderboardRequest;
import world.betterserver.server.model.dto.response.leaderboard.LeaderboardEntry;
import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;
import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStatRepository;
import world.betterserver.server.service.mcStats.McStatsService;
import world.betterserver.server.service.mcUUID.UUIDTranslatorService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class LeaderboardController implements LeaderboardControllerTemplate {

    private final UUIDTranslatorService translator;
    private final McStatsService statsService;
    private final McPlayerStatRepository statRepository;

    @Override
    public List<LeaderboardEntry> getLeaderboardForStat(String statKey) {
        return this.statsService.getAllStatsNamed(List.of(statKey.split(","))).stream()
                .map(this::generateLeaderboardFromStat)
                .toList();
    }

    @Override
    public List<List<LeaderboardEntry>> getLeaderboardsForStats(MultipleLeaderboardRequest request) {
        return request.statKeys().stream()
                .map(this.statsService::getAllStatsNamed)
                .map(stats -> stats.stream()
                        .map(this::generateLeaderboardFromStat)
                        .toList()
                )
                .toList();
    }

    @Override
    public Map<String, String> getLeadersFor(List<String> statKeys) {
        Map<String, String> res = new HashMap<>();
        statKeys.forEach(k -> this.findStatLeader(k, res));
        return res;
    }

    private @NonNull LeaderboardEntry generateLeaderboardFromStat(McPlayerStat stat) {
        McPlayer player = this.translator.findPlayer(stat.getPlayerUuid());
        StatSummary summary = new StatSummary(
                player.uuid(),
                stat.getStatKey(),
                stat.getStatValue(),
                stat.getUpdatedAt()
        );
        return new LeaderboardEntry(
                player.username(),
                player.uuid(),
                summary
        );
    }

    private void findStatLeader(String statKey, Map<String, String> map) {
        String[] requests = statKey.split(",");
        for (String k : requests) {
            UUID uuid = this.statRepository.findUuidByStatKeyOrderByStatValueDesc(k).getFirst();
            String username = this.translator.findPlayer(uuid).username();
            map.put(k, username);
        }
    }
}
