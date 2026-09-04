package world.betterserver.server.model.dto.request.suggestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import world.betterserver.server.model.entity.suggestion.SuggestionStatus;

public record ChangeStatusRequest(

        @NotBlank(message = "Title is required")
        String suggestionTitle,

        @NotNull(message = "New status is required")
        SuggestionStatus newStatus
) {
}
