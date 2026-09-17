package world.betterserver.server.model.dto.response.wiki;

import java.time.Instant;
import java.util.Set;

public record WikiPost(
        String title,
        String body,
        Instant createdAt,
        String createdBy,
        Set<String> upvotes,
        Set<String> downvotes
) {
}
