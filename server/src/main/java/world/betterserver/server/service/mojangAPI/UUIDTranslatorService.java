package world.betterserver.server.service.mojangAPI;

import world.betterserver.server.model.dto.response.mcPlayer.MojangAPIPlayer;

import java.util.UUID;

public interface UUIDTranslatorService {

    MojangAPIPlayer findPlayer(UUID uuid);
    MojangAPIPlayer findPlayer(String username);
}
