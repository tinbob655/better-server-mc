package world.betterserver.server.model.dto.request.suggestion;

import jakarta.validation.constraints.NotBlank;

public record NewSuggestionRequest(

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description
) {
}
