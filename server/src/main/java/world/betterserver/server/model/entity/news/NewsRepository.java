package world.betterserver.server.model.entity.news;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NewsRepository extends JpaRepository<News, Long> {
    Optional<News> findByDiscordMessageId(String discordMessageId);
    List<News> findAllByOrderByCreatedAtDesc();

    long deleteByTitle(String title);
}
