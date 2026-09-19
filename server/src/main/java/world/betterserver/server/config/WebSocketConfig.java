package world.betterserver.server.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import world.betterserver.server.service.serverStatus.ServerStatusWebsocket;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final ServerStatusWebsocket serverStatusWebsocket;

    @Value("${client.vite.url}")
    private String viteURL;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(this.serverStatusWebsocket, "/ws/serverStatus")
                .setAllowedOrigins(this.viteURL);
    }
}