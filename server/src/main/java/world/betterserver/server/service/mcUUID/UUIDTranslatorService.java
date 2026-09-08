package world.betterserver.server.service.mcUUID;

import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;

import java.util.UUID;

public interface UUIDTranslatorService {

    McPlayer findPlayer(UUID uuid);
    McPlayer findPlayer(String username);
}
