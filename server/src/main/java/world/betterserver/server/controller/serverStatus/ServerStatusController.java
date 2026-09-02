package world.betterserver.server.controller.serverStatus;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import world.betterserver.server.model.dto.response.ServerStatusMessage;

@RestController
public final class ServerStatusController implements ServerStatusControllerTemplate {

    private final String mcServerAddress;
    private final RestClient restClient;

    public ServerStatusController(
            @Value("${mcstatus.api.base-url}") String mcstatusBaseURL,
            @Value("${mcstatus.server.address}") String mcServerAddress
    ) {
        this.mcServerAddress = mcServerAddress;
        this.restClient = RestClient.builder()
                .baseUrl(mcstatusBaseURL)
                .build();
    }

    @Override
    public ServerStatusMessage getServerStatus() {
        try {
            ServerStatusMessage message = this.restClient.get()
                    .uri("/status/java/{address}", this.mcServerAddress)
                    .retrieve()
                    .body(ServerStatusMessage.class);

            return message != null ? message : ServerStatusMessage.offline();
        }
        catch (RestClientException e) {
            return ServerStatusMessage.offline();
        }
    }
}