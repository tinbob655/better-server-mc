package world.betterserver.server.controller.serverStatus;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import world.betterserver.server.model.dto.response.serverStatus.ServerStatusMessage;

@RestController
public class ServerStatusController implements ServerStatusControllerTemplate {

    @Value("${mcstatus.server.address}")
    private String mcServerAddress;

    private final RestClient serverStatusRestClient;

    public ServerStatusController(
            @Qualifier("serverStatusRestClient") RestClient serverStatusRestClient
    ) {
        this.serverStatusRestClient = serverStatusRestClient;
    }

    @Override
    public ServerStatusMessage getServerStatus() {
        try {
            ServerStatusMessage message = this.serverStatusRestClient.get()
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