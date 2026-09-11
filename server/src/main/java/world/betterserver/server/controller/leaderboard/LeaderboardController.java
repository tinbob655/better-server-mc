package world.betterserver.server.controller.leaderboard;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.leaderboard.MultipleLeaderboardRequest;
import world.betterserver.server.model.dto.response.leaderboard.LeaderboardEntry;
import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;
import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.service.mcStats.McStatsService;
import world.betterserver.server.service.mcUUID.UUIDTranslatorService;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class LeaderboardController implements LeaderboardControllerTemplate {

    private final UUIDTranslatorService translator;
    private final McStatsService statsService;

    private static final String CATEGORY_PREFIX = "category:";

    @Override
    public List<LeaderboardEntry> getLeaderboardForStat(String statKey) {
        return this.resolveStats(statKey).stream()
                .map(this::generateLeaderboardFromStat)
                .toList();
    }

    @Override
    public List<List<LeaderboardEntry>> getLeaderboardsForStats(MultipleLeaderboardRequest request) {
        return request.statKeys().stream()
                .map(this::getLeaderboardForStat)
                .toList();
    }

    @Override
    public Map<String, String> getLeadersFor(List<String> statKeys) {
        Map<String, String> res = new LinkedHashMap<>();
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
        List<McPlayerStat> stats = this.resolveStats(statKey);
        if (stats.isEmpty()) return;    //noone has done this stat yet

        UUID leaderUuid = stats.getFirst().getPlayerUuid();
        String username = this.translator.findPlayer(leaderUuid).username();
        map.put(statKey, username);
    }

    private List<McPlayerStat> resolveStats(String statKey) {
        return statKey.startsWith(CATEGORY_PREFIX)
                ? this.statsService.getAllStatsByCategory(statKey.substring(CATEGORY_PREFIX.length()))
                : this.statsService.getAllStatsNamed(List.of(statKey.split(",")));
    }
}
