package world.betterserver.server.controller.serverStatus;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import world.betterserver.server.model.dto.response.serverStatus.ServerStatusMessage;

@RequestMapping("api/serverStatus")
public interface ServerStatusControllerTemplate {

    @GetMapping
    ServerStatusMessage getServerStatus();
}
