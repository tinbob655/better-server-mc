package world.betterserver.server.service.discord.listener;

import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.channel.unions.MessageChannelUnion;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.message.MessageUpdateEvent;
import net.dv8tion.jda.api.utils.ImageProxy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import world.betterserver.server.model.entity.news.News;
import world.betterserver.server.model.entity.news.NewsRepository;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;
import world.betterserver.server.service.htmlSanitiser.HtmlSanitiserService;
import world.betterserver.server.service.profilePicture.ProfilePictureService;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // see note below
class ChannelListenerTest {

    private static final String ANNOUNCEMENTS_ID = "111222333";

    @Mock private NewsRepository newsRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProfilePictureService profilePictureService;
    @Mock private HtmlSanitiserService sanitiser;
    @Mock private PasswordEncoder passwordEncoder;

    private ChannelListener listener;

    @BeforeEach
    void setUp() {
        listener = new ChannelListener(newsRepository, userRepository, profilePictureService, sanitiser, passwordEncoder);
        ReflectionTestUtils.setField(listener, "announcementsId", ANNOUNCEMENTS_ID);

        //no op default
        when(sanitiser.sanitise(anyString())).thenAnswer(inv -> inv.getArgument(0));
    }

    // ---- helpers: build a fake JDA event with just the getters our code touches ----

    private MessageReceivedEvent mockReceivedEvent(String channelId, String authorName, boolean isBot, String messageId, String content) {
        MessageReceivedEvent event = mock(MessageReceivedEvent.class);
        MessageChannelUnion channel = mock(MessageChannelUnion.class);
        Message message = mock(Message.class);
        net.dv8tion.jda.api.entities.User author = mock(net.dv8tion.jda.api.entities.User.class);

        when(event.getChannel()).thenReturn(channel);
        when(channel.getId()).thenReturn(channelId);
        when(event.getAuthor()).thenReturn(author);
        when(author.getName()).thenReturn(authorName);
        when(author.isBot()).thenReturn(isBot);
        when(event.getMessageId()).thenReturn(messageId);
        when(event.getMessage()).thenReturn(message);
        when(message.getContentRaw()).thenReturn(content);
        when(message.getTimeCreated()).thenReturn(OffsetDateTime.now());

        return event;
    }

    private MessageUpdateEvent mockUpdateEvent(String channelId, String authorName, boolean isBot, String messageId, String content) {
        MessageUpdateEvent event = mock(MessageUpdateEvent.class);
        MessageChannelUnion channel = mock(MessageChannelUnion.class);
        Message message = mock(Message.class);
        net.dv8tion.jda.api.entities.User author = mock(net.dv8tion.jda.api.entities.User.class);

        when(event.getChannel()).thenReturn(channel);
        when(channel.getId()).thenReturn(channelId);
        when(event.getAuthor()).thenReturn(author);
        when(author.getName()).thenReturn(authorName);
        when(author.isBot()).thenReturn(isBot);
        when(event.getMessageId()).thenReturn(messageId);
        when(event.getMessage()).thenReturn(message);
        when(message.getContentRaw()).thenReturn(content);

        return event;
    }

    // ---- onMessageReceived ----

    @Test
    void ignoresMessagesFromOtherChannels() {
        var event = mockReceivedEvent("999999999", "someone", false, "msg1", "Title\nBody");

        listener.onMessageReceived(event);

        verifyNoInteractions(newsRepository, userRepository);
    }

    @Test
    void ignoresMessagesFromBots() {
        var event = mockReceivedEvent(ANNOUNCEMENTS_ID, "webhook-bot", true, "msg1", "Title\nBody");

        listener.onMessageReceived(event);

        verifyNoInteractions(newsRepository, userRepository);
    }

    @Test
    void ignoresBlankMessages() {
        var event = mockReceivedEvent(ANNOUNCEMENTS_ID, "someone", false, "msg1", "   \n   ");

        listener.onMessageReceived(event);

        verifyNoInteractions(newsRepository);
    }

    @Test
    void createsNewsForExistingPoster() {
        User existingPoster = new User("tinbob655", "hash", "pfp.png");
        when(userRepository.findByUsername("tinbob655")).thenReturn(Optional.of(existingPoster));

        var event = mockReceivedEvent(
                ANNOUNCEMENTS_ID, "tinbob655", false, "msg1",
                "Server maintenance tonight\nWe'll be down for an hour at 10pm."
        );

        listener.onMessageReceived(event);

        ArgumentCaptor<News> captor = ArgumentCaptor.forClass(News.class);
        verify(newsRepository).save(captor.capture());

        News saved = captor.getValue();
        assertEquals("Server maintenance tonight", saved.getTitle());
        assertEquals("<p>We'll be down for an hour at 10pm.</p>", saved.getBody());
        assertEquals("msg1", saved.getDiscordMessageId());
        assertSame(existingPoster, saved.getCreatedBy());

        verify(userRepository, never()).save(any()); // shouldn't create an account for a known user
    }

    @Test
    void createsAccountAndNewsForFirstTimePoster() throws Exception {
        when(userRepository.findByUsername("newPerson")).thenReturn(Optional.empty());

        // fake the avatar "download" so it resolves immediately instead of
        // actually reaching out to Discord's CDN over the network
        ImageProxy avatarProxy = mock(ImageProxy.class);
        InputStream fakeAvatarBytes = new ByteArrayInputStream(new byte[]{1, 2, 3});
        when(avatarProxy.download()).thenReturn(CompletableFuture.completedFuture(fakeAvatarBytes));

        when(profilePictureService.store(eq("Discord user: newPerson"), any(), anyString(), anyString()))
                .thenReturn("stored-avatar.png");
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");

        var event = mockReceivedEvent(ANNOUNCEMENTS_ID, "newPerson", false, "msg2", "Welcome!\nGlad to have you.");
        when(event.getAuthor().getEffectiveAvatar()).thenReturn(avatarProxy);

        listener.onMessageReceived(event);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("Discord user: newPerson", userCaptor.getValue().getUsername());
        assertEquals("encoded-password", userCaptor.getValue().getPasswordHash());

        ArgumentCaptor<News> newsCaptor = ArgumentCaptor.forClass(News.class);
        verify(newsRepository).save(newsCaptor.capture());
        assertEquals("Welcome!", newsCaptor.getValue().getTitle());
        assertSame(userCaptor.getValue(), newsCaptor.getValue().getCreatedBy());
    }

    // ---- onMessageUpdate ----

    @Test
    void updatesExistingNewsOnEdit() {
        News existing = new News();
        existing.setDiscordMessageId("msg1");
        existing.setTitle("Old title");
        existing.setBody("<p>Old body</p>");

        when(newsRepository.findByDiscordMessageId("msg1")).thenReturn(Optional.of(existing));

        var event = mockUpdateEvent(ANNOUNCEMENTS_ID, "tinbob655", false, "msg1", "New title\nNew body");

        listener.onMessageUpdate(event);

        assertEquals("New title", existing.getTitle());
        assertEquals("<p>New body</p>", existing.getBody());
        verify(newsRepository).save(existing);
    }

    @Test
    void ignoresEditsToUntrackedMessages() {
        when(newsRepository.findByDiscordMessageId("unknown")).thenReturn(Optional.empty());

        var event = mockUpdateEvent(ANNOUNCEMENTS_ID, "tinbob655", false, "unknown", "New title\nNew body");

        listener.onMessageUpdate(event);

        verify(newsRepository, never()).save(any());
    }
}