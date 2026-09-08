package world.betterserver.server.model.dto.response.mcPlayer;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MojangAPIPlayer(
        @JsonAlias("id") UUID UUID,
        @JsonAlias("name") String username
) {
}
