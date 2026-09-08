package world.betterserver.server.model.dto.response.mcPlayer;

import java.time.Instant;
import java.util.UUID;

public record StatSummary(

        UUID uuid,
        String statKey,
        long statValue,
        Instant updatedAt
) {
}
