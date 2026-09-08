package world.betterserver.server.service.mcUUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import world.betterserver.server.model.dto.response.mcPlayer.GeyserGamertag;
import world.betterserver.server.model.dto.response.mcPlayer.McPlayer;

import java.util.UUID;

@Service
public class UUIDTranslatorServiceImpl implements UUIDTranslatorService {

    private final RestClient mojangRestClient;
    private final RestClient geyserRestClient;

    public UUIDTranslatorServiceImpl(
            @Qualifier("mojangRestClient") RestClient mojangRestClient,
            @Qualifier("geyserRestClient") RestClient geyserRestClient
    ) {
        this.mojangRestClient = mojangRestClient;
        this.geyserRestClient = geyserRestClient;
    }

    @Override
    @Cacheable("playersByUuid")
    public McPlayer findPlayer(UUID uuid) {
        if (this.isBedrockPlayer(uuid)) {

            long xuid = this.extractBedrockXUID(uuid);

            try {
                GeyserGamertag response = this.geyserRestClient.get()
                        .uri("/v2/xbox/gamertag/{xuid}", xuid)
                        .retrieve()
                        .body(GeyserGamertag.class);

                if (response == null) {
                    throw new IllegalStateException("Geyser API could not find a player for UUID: " + uuid);
                }

                return response.toPlayer(uuid);
            }
            catch (RestClientResponseException e) {

                //this means geyser did not have the player cached at this point in time
                return new McPlayer(uuid, "UNKNOWN_USER");
            }
        }
        else {
            return this.mojangRestClient.get()
                    .uri("/user/profile/{uuid}", uuid)
                    .retrieve()
                    .body(McPlayer.class);
        }
    }

    @Override
    @Cacheable("playersByUsername")
    public McPlayer findPlayer(String username) {

        //the geyser API is able to determine if a player is on bedrock or java and respond with the same DTO
        return this.geyserRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/utils/uuid/bedrock_or_java/{username}")
                        .queryParam("prefix", ".")
                        .build(username))
                .retrieve()
                .body(McPlayer.class);
    }

    private boolean isBedrockPlayer(UUID uuid) {
        return uuid.getMostSignificantBits() == 0
                && (uuid.getLeastSignificantBits() >>> 48) == 0x0009;
    }

    private long extractBedrockXUID(UUID uuid) {
        String hex = uuid.toString()
                .replace("-", "")
                .substring(24);
        return Long.parseUnsignedLong(hex, 16);
    }
}
