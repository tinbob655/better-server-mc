package world.betterserver.server.model.dto.response.suggestion;

import world.betterserver.server.model.entity.suggestion.SuggestionStatus;

import java.time.Instant;

public record SuggestionResponse(
        String title,
        String description,
        SuggestionStatus status,
        String adminResponse,
        String posterUsername,
        Instant createdAt
) {
}
