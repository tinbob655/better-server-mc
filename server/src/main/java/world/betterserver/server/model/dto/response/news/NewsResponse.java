package world.betterserver.server.model.dto.response.news;

import java.time.Instant;

public record NewsResponse(
        String title,
        String body,
        String createdBy,
        Instant createdAt
) {
}
