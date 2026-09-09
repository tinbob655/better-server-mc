package world.betterserver.server.model.dto.response.poll;

import world.betterserver.server.model.dto.response.auth.UserSummary;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public record DetailedPoll(

        String title,
        Instant createdAt,
        Instant expiresAt,
        boolean anonymous,
        List<PollOption> options
) {

    public record PollOption(
            String name,
            String color,
            Set<UserSummary> voters
    ) {}
}
