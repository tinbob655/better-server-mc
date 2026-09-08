package world.betterserver.server.controller.mcStat;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import world.betterserver.server.model.dto.response.mcPlayer.MojangAPIPlayer;
import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RequestMapping("/api/mcPlayer")
public interface McStatControllerTemplate {

    @GetMapping("/allPlayers")
    Set<MojangAPIPlayer> getAllPlayers();

    @GetMapping("/statsFor/{UUID}")
    Set<StatSummary> getStatsFor(@PathVariable UUID UUID);

    @GetMapping("/everything")
    Map<UUID, Set<StatSummary>> getAllStats();
}
