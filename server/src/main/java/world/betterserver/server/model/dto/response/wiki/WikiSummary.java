package world.betterserver.server.model.dto.response.wiki;

import java.time.Instant;
import java.util.Set;

public record WikiSummary(
        String title,
        String createdBy,
        Instant createdAt,
        Set<String> upvotes,
        Set<String> downvotes
) {
}
