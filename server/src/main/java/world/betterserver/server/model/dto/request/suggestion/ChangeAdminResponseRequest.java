package world.betterserver.server.model.dto.request.suggestion;

import jakarta.validation.constraints.NotBlank;

public record ChangeAdminResponseRequest(

        @NotBlank(message = "Title is required")
        String suggestionTitle,

        @NotBlank(message = "Admin response is required")
        String adminResponse
) {
}
