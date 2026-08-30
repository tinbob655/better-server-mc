package world.betterserver.server.controller.serverStatus;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import world.betterserver.server.dto.ServerStatusMessage;

@RestController
public class ServerStatusController implements ServerStatusControllerTemplate {

    @Value("${mcstatus.api.base-url}")
    String mcstatusBaseURL;

    @Value("${mcstatus.server.address}")
    String mcServerAddress;

    private final RestClient restClient;

    public ServerStatusController() {
        this.restClient = RestClient.builder()
                .baseUrl(this.mcstatusBaseURL)
                .build();
    }

    @Override
    public ServerStatusMessage getServerStatus() {

        try {
        return this.restClient.get()
                .uri("/status/java/{address}", this.mcServerAddress)
                .retrieve()
                .body(ServerStatusMessage.class);
        }

        //if the server was offline
        catch (RestClientException e) {
            return ServerStatusMessage.offline();
        }
    }
}
