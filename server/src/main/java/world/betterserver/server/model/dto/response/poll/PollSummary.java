package world.betterserver.server.model.dto.response.poll;

import java.time.Instant;

public record PollSummary(
        String title,
        Instant createdAt,
        Instant expiresAt
) {}
