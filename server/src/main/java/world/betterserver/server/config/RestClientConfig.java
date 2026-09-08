package world.betterserver.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${mcstatus.api.base-url}")
    String mcstatusBaseURL;

    @Bean("serverStatusRestClient")
    public RestClient serverStatusRestClient() {
        return RestClient.builder()
                .baseUrl(mcstatusBaseURL)
                .build();
    }

    @Bean("mojangRestClient")
    public RestClient mojangRestClient() {
        return RestClient.builder()
                .baseUrl("https://api.mojang.com")
                .build();
    }

    @Bean("geyserRestClient")
    public RestClient geyserRestClient() {
        return RestClient.builder()
                .baseUrl("https://api.geysermc.org")
                .build();
    }
}
