package world.betterserver.server.model.dto.response.discord;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DiscordTokenResponse(
        @JsonProperty("access_token") String accessToken
) {
}
