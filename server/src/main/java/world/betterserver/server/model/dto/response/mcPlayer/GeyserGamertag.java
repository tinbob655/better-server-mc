package world.betterserver.server.model.dto.response.mcPlayer;

import java.util.UUID;

public record GeyserGamertag(String gamertag) {

    public McPlayer toPlayer(UUID uuid) {
        return new McPlayer(uuid, gamertag);
    }
}
