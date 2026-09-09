package world.betterserver.server.model.dto.request.poll;

import jakarta.validation.constraints.NotBlank;


public record NewPollOptionRequest(

        @NotBlank(message = "Option name is required")
        String name,

        @NotBlank(message = "Colour is required")
        String color
) {
}
