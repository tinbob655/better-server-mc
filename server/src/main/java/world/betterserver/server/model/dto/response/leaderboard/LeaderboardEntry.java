package world.betterserver.server.model.dto.response.leaderboard;

import world.betterserver.server.model.dto.response.mcPlayer.StatSummary;

import java.util.UUID;

public record LeaderboardEntry(

        String playerName,
        UUID uuid,
        StatSummary statSummary
) {
}
