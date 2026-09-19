package world.betterserver.server.service.discord.listener;

import lombok.RequiredArgsConstructor;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.message.MessageUpdateEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import world.betterserver.server.model.entity.news.News;
import world.betterserver.server.model.entity.news.NewsRepository;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;
import world.betterserver.server.service.htmlSanitiser.HtmlSanitiserService;
import world.betterserver.server.service.profilePicture.ProfilePictureService;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public final class ChannelListener extends ListenerAdapter {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final ProfilePictureService profilePictureService;
    private final HtmlSanitiserService sanitiser;
    private final PasswordEncoder passwordEncoder;

    @Value("${discord.channels.announcements}")
    private String announcementsId;

    @Override
    public void onMessageReceived(@NonNull MessageReceivedEvent event) {
        if (!this.isAnnouncementsChannel(event.getChannel().getId()) || event.getAuthor().isBot()) return;

        ParsedContent content = this.parseContent(event.getMessage().getContentRaw());
        if (content.title().isBlank()) return; //nothing usable to post

        News news = new News();
        news.setDiscordMessageId(event.getMessageId());
        news.setCreatedAt(event.getMessage().getTimeCreated().toInstant());
        news.setTitle(content.title());
        news.setBody(content.body());

        //we might need to download a profile picture so this has to be done in a callback
        this.resolvePoster(event.getAuthor(), poster -> {
            news.setCreatedBy(poster);
            this.newsRepository.save(news);
        });
    }

    @Override
    public void onMessageUpdate(@NonNull MessageUpdateEvent event) {
        if (!this.isAnnouncementsChannel(event.getChannel().getId()) || event.getAuthor().isBot()) return;

        this.newsRepository.findByDiscordMessageId(event.getMessageId()).ifPresent(news -> {
            ParsedContent content = this.parseContent(event.getMessage().getContentRaw());
            if (content.title().isBlank()) return;

            news.setTitle(content.title());
            news.setBody(content.body());
            this.newsRepository.save(news);
        });
    }

    //helpers

    private boolean isAnnouncementsChannel(String channelId) {
        return channelId.equals(this.announcementsId);
    }

    private record ParsedContent(String title, String body) {}

    //treat the first line as the title and the rest as the content
    private ParsedContent parseContent(String rawContent) {
        String[] parts = rawContent.strip().split("\\R", 2);
        String title = parts[0].strip();
        String body = parts.length > 1 ? this.toSimpleHtml(parts[1].strip()) : "";
        return new ParsedContent(title, body);
    }

    //converts discord text into html
    private String toSimpleHtml(String rawBody) {
        String escaped = rawBody
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");

        String html = Arrays.stream(escaped.split("\\R{2,}"))
                .map(paragraph -> "<p>" + paragraph.replace("\n", "<br>") + "</p>")
                .collect(Collectors.joining());

        return this.sanitiser.sanitise(html);
    }

    //tries to find a user with the same username as the discord poster, if not creates one
    private void resolvePoster(net.dv8tion.jda.api.entities.User discordAuthor, Consumer<User> onResolved) {
        String username = discordAuthor.getName();

        Optional<User> existing = this.userRepository.findByUsername(username);
        if (existing.isPresent()) {
            onResolved.accept(existing.get());
            return;
        }

        String discordUsername = "Discord user: " + username;
        discordAuthor.getEffectiveAvatar().download().thenAccept(inputStream -> {
            try {
                String storedPfp = this.profilePictureService.store(discordUsername, inputStream, "avatar.png", "image/png");
                User newUser = new User(discordUsername, this.passwordEncoder.encode(generateRandomPassword()), storedPfp);
                this.userRepository.save(newUser);
                onResolved.accept(newUser);
            }
            catch (IOException e) {
                System.err.println("Failed to create account for Discord user " + username + ": " + e.getMessage());
            }
        });
    }

    public static String generateRandomPassword() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}