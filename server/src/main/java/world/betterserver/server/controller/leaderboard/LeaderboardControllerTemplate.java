package world.betterserver.server.controller.leaderboard;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.leaderboard.MultipleLeaderboardRequest;
import world.betterserver.server.model.dto.response.leaderboard.LeaderboardEntry;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/leaderboard")
public interface LeaderboardControllerTemplate {

    @GetMapping("/single/{statKey}")
    List<LeaderboardEntry> getLeaderboardForStat(@PathVariable String statKey);

    @GetMapping("/many")
    List<List<LeaderboardEntry>> getLeaderboardsForStats(@RequestBody @Valid MultipleLeaderboardRequest request);

    @GetMapping("/getLeadersFor")
    Map<String, String> getLeadersFor(@RequestParam List<@NotBlank String> statKeys);
}
