package world.betterserver.server.controller.serverStatus;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.response.serverStatus.ServerStatusMessage;
import world.betterserver.server.service.serverStatus.ServerStatusService;

@RestController
@RequiredArgsConstructor
public class ServerStatusController implements ServerStatusControllerTemplate {

    private final ServerStatusService serverStatusService;

    @Override
    public ServerStatusMessage getServerStatus() {
        return this.serverStatusService.fetchStatus();
    }
}