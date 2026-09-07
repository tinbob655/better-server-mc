package world.betterserver.server.model.dto.request.news;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewNewsRequest(

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Body is required")
        @Size(min = 10, message = "Body must be at least 10 characters long")
        String body
) {
}
