package world.betterserver.server.model.dto.request.news;

import jakarta.validation.constraints.NotBlank;

public record DeleteNewsRequest(

        @NotBlank(message = "Title is required")
        String title
) {
}
