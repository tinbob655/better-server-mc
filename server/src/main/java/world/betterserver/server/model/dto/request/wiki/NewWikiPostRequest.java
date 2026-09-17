package world.betterserver.server.model.dto.request.wiki;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewWikiPostRequest(

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Body is required")
        @Size(min = 20, message = "Body must be at least 20 characters long")
        String body
) {
}
