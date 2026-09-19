package world.betterserver.server.service.serverStatus;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServerStatusBroadcaster {

    private final ServerStatusService statusService;
    private final ServerStatusWebsocket serverStatusWebsocket;

    @Scheduled(fixedRateString = "${serverstatus.broadcast-interval-ms}")
    public void pollAndBroadcast() {
        this.serverStatusWebsocket.broadcast(this.statusService.fetchStatus());
    }
}