package world.betterserver.server.model.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ServerStatusMessage(
        boolean online,
        @JsonAlias("retrieved_at") long retrievedAt,
        Version version,
        Players players,
        Motd motd,
        String icon
) {

    //record containing version info
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Version(
            @JsonAlias("name_clean") String nameClean,
            int protocol
    ) {}

    //record containing player info
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Players(
            int online,
            int max,
            List<Player> list
    ) {}

    //record for a single player
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Player(
            String uuid,
            @JsonAlias("name_clean") String nameClean
    ) {}

    //record containing motd info
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Motd(String clean) {}

    // Fallback used when the request to mcstatus.io fails outright
    public static ServerStatusMessage offline() {
        return new ServerStatusMessage(false, 0, null, null, null, null);
    }
}
