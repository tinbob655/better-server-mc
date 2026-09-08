package world.betterserver.server.service.mojangAPI;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import world.betterserver.server.model.dto.response.mcPlayer.MojangAPIPlayer;

import java.util.UUID;

@Service
public class UUIDTranslatorServiceImpl implements UUIDTranslatorService {

    private final RestClient mojangRestClient;

    public UUIDTranslatorServiceImpl(
            @Qualifier("mojangRestClient") RestClient mojangRestClient
    ) {
        this.mojangRestClient = mojangRestClient;
    }

    @Override
    public MojangAPIPlayer findPlayer(UUID uuid) {
        return this.mojangRestClient.get()
                .uri("/user/profile/{uuid}", uuid.toString())
                .retrieve()
                .body(MojangAPIPlayer.class);
    }

    @Override
    public MojangAPIPlayer findPlayer(String username) {
        return this.mojangRestClient.get()
                .uri("/users/profiles/minecraft/{username}", username)
                .retrieve()
                .body(MojangAPIPlayer.class);
    }
}
