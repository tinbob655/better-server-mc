package world.betterserver.server.model.dto.request.leaderboard;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record MultipleLeaderboardRequest(

        @NotEmpty(message = "Stat names are required")
        List<@NotBlank(message = "Stat names cannot be blank") String> statKeys
) {
}
