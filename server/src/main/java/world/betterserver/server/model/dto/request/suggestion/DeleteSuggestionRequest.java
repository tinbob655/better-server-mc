package world.betterserver.server.model.dto.request.suggestion;

import jakarta.validation.constraints.NotBlank;

public record DeleteSuggestionRequest(

        @NotBlank(message = "Suggestion title is required")
        String title
) {
}
