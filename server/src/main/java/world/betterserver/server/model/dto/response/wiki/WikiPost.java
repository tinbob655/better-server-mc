package world.betterserver.server.model.dto.response.wiki;

import java.time.Instant;

public record WikiPost(
        String title,
        String body,
        Instant createdAt,
        String createdBy,
        int upvotes,
        int downvotes
) {
}
