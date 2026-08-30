package world.betterserver.server.model.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ServerStatusMessage(
        boolean online,
        String host,
        int port,
        Version version,
        Players players,
        Motd motd,
        String icon
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Version(
            @JsonProperty("name_clean") String nameClean,
            int protocol
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Players(int online, int max) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Motd(String clean) {}

    // Fallback used when the request to mcstatus.io fails outright
    public static ServerStatusMessage offline() {
        return new ServerStatusMessage(false, null, 0, null, null, null, null);
    }
}
