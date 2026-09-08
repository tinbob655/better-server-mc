package world.betterserver.server.controller.mcStat;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;
import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/api/mcPlayer")
public interface McStatControllerTemplate {

    @GetMapping("/allPlayers")
    List<McPlayer> getAllPlayers();

    @GetMapping("/statsFor/{UUID}")
    List<StatSummary> getStatsFor(@PathVariable UUID UUID);

    @GetMapping("/everything")
    Map<UUID, List<StatSummary>> getAllStats();
}
