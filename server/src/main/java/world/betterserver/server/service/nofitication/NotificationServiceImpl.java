package world.betterserver.server.service.nofitication;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JDA jda;
    private TextChannel adminNotificationsChannel;

    @Value("${discord.channels.website-admin-notifications}")
    private String notificationsChannelId;

    @PostConstruct
    private void getChannel() {
        this.adminNotificationsChannel = this.jda.getTextChannelById(this.notificationsChannelId);
    }

    @Override
    public void notifyDiscord(String message) {
        if (this.adminNotificationsChannel == null) {
            System.err.println("Could not find Discord notifications channel with id: " + this.notificationsChannelId);
            return;
        }

        this.adminNotificationsChannel.sendMessage(message).queue(
                _ -> {},
                failure -> System.err.println("Failed to send Discord notification: " + failure.getMessage())
        );
    }
}