package world.betterserver.server.service.discord.OAuth;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import world.betterserver.server.model.dto.response.discord.DiscordGuild;
import world.betterserver.server.model.dto.response.discord.DiscordTokenResponse;

import java.util.List;

@Service
public class DiscordOAuthServiceImpl implements DiscordOAuthService {

    private final RestClient discordRestClient;

    @Value("${discord.client-id}")
    private String clientId;

    @Value("${discord.client-secret}")
    private String clientSecret;

    @Value("${discord.redirect-uri}")
    private String redirectUri;

    @Value("${discord.guild-id}")
    private String guildId;

    public DiscordOAuthServiceImpl(@Qualifier("discordRestClient") RestClient discordRestClient) {
        this.discordRestClient = discordRestClient;
    }

    //swap the one time code for a discord token
    @Override
    public String exchangeCodeForAccessToken(String code) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", this.clientId);
        form.add("client_secret", this.clientSecret);
        form.add("grant_type", "authorization_code");
        form.add("code", code);
        form.add("redirect_uri", this.redirectUri);

        DiscordTokenResponse response = this.discordRestClient.post()
                .uri("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(DiscordTokenResponse.class);

        if (response == null) throw new IllegalStateException("Discord did not return an access token");
        return response.accessToken();
    }

    //is the user a member of the better server discord
    @Override
    public boolean isGuildMember(String accessToken) {
        List<DiscordGuild> guilds = this.discordRestClient.get()
                .uri("/users/@me/guilds")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        return guilds != null && guilds.stream().anyMatch(g -> g.id().equals(this.guildId));
    }
}
