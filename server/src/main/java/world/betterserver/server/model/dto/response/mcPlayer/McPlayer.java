package world.betterserver.server.model.dto.response.mcPlayer;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import tools.jackson.databind.annotation.JsonDeserialize;
import world.betterserver.server.service.mcUUID.MojangUUIDDeserializer;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record McPlayer(

        @JsonDeserialize(using = MojangUUIDDeserializer.class)
        @JsonAlias("id")
        UUID uuid,

        @JsonAlias("name") String username
) {
}
