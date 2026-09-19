package world.betterserver.server.config;

import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import world.betterserver.server.service.discord.listener.ChannelListener;

@Configuration
@RequiredArgsConstructor
public class DiscordConfig {

    private final ChannelListener channelListener;

    @Value("${discord.bot.token}")
    private String botToken;

    //bot exits cleanly when the server stops
    @Bean(destroyMethod = "shutdown")
    public JDA jda() throws InterruptedException {
        JDA jda = JDABuilder.createDefault(this.botToken)
                .enableIntents(GatewayIntent.GUILD_MESSAGES, GatewayIntent.MESSAGE_CONTENT)
                .addEventListeners(this.channelListener)
                .build();

        //we have to wait so that anything else can always assume the bot is working
        jda.awaitReady();
        return jda;
    }
}