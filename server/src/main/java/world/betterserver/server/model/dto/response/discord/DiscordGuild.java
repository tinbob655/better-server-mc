package world.betterserver.server.model.dto.response.discord;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DiscordGuild(
        String id,
        String name
) {
}
