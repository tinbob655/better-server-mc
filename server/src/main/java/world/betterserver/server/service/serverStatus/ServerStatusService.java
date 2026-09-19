package world.betterserver.server.service.serverStatus;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import world.betterserver.server.model.dto.response.serverStatus.ServerStatusMessage;

@Service
public class ServerStatusService {

    @Value("${mcstatus.server.address}")
    private String mcServerAddress;

    private final RestClient serverStatusRestClient;

    public ServerStatusService(@Qualifier("serverStatusRestClient") RestClient serverStatusRestClient) {
        this.serverStatusRestClient = serverStatusRestClient;
    }

    public ServerStatusMessage fetchStatus() {
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