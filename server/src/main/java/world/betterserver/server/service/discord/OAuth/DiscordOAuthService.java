package world.betterserver.server.service.discord.OAuth;

public interface DiscordOAuthService {

    String exchangeCodeForAccessToken(String code);
    boolean isGuildMember(String accessToken);
}
