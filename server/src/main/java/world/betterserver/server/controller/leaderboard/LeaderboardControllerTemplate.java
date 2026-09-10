package world.betterserver.server.controller.leaderboard;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import world.betterserver.server.model.dto.request.leaderboard.MultipleLeaderboardRequest;
import world.betterserver.server.model.dto.response.leaderboard.LeaderboardEntry;

import java.util.List;

@RequestMapping("/api/leaderboard")
public interface LeaderboardControllerTemplate {

    @GetMapping("/single/{statKey}")
    List<LeaderboardEntry> getLeaderboardForStat(@PathVariable String statKey);

    @GetMapping("/many")
    List<List<LeaderboardEntry>> getLeaderboardsForStats(@RequestBody @Valid MultipleLeaderboardRequest request);
}
