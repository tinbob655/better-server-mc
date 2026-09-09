package world.betterserver.server.model.dto.request.poll;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record NewPollRequest(

        @NotBlank(message = "Poll title is required")
        String title,

        @NotNull(message = "Whether to be anonymous must be specified")
        boolean anonymous,

        @NotNull(message = "Expiry date is required")
        Instant expiresAt,

        @NotEmpty(message = "As least one poll option must be specified")
        List<NewPollOptionRequest> defaultOptions
) {
}
