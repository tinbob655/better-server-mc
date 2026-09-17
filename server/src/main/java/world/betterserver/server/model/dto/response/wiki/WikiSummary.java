package world.betterserver.server.model.dto.response.wiki;

import java.time.Instant;

public record WikiSummary(
        String title,
        String createdBy,
        Instant createdAt,
        int upvotes,
        int downvotes
) {
}
