package world.betterserver.server.service.serverStatus;

import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;
import world.betterserver.server.model.dto.response.serverStatus.ServerStatusMessage;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ServerStatusWebsocket extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final ObjectMapper objectMapper = new ObjectMapper();

    //always cache the result so someone connecting between polls gets an update
    private volatile ServerStatusMessage latestStatus = ServerStatusMessage.offline();

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        this.sessions.add(session);
        this.sendTo(session, this.latestStatus);
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        this.sessions.remove(session);
    }

    public void broadcast(ServerStatusMessage status) {
        this.latestStatus = status;
        String payload = this.objectMapper.writeValueAsString(status);

        for (WebSocketSession session : this.sessions) {
            if (!session.isOpen()) {
                this.sessions.remove(session);
                continue;
            }
            try {
                session.sendMessage(new TextMessage(payload));
            }
            catch (IOException e) {
                System.err.println("Failed to send server status to a session: " + e.getMessage());
                this.sessions.remove(session);
            }
        }
    }

    private void sendTo(WebSocketSession session, ServerStatusMessage status) {
        if (!session.isOpen()) {
            this.sessions.remove(session);
            return;
        }

        try {
            session.sendMessage(new TextMessage(this.objectMapper.writeValueAsString(status)));
        }
        catch (IOException e) {
            this.sessions.remove(session);
        }
    }
}