package world.betterserver.server.model.entity.poll;

import org.springframework.data.jpa.repository.JpaRepository;
import world.betterserver.server.model.dto.response.poll.PollSummary;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PollRepository extends JpaRepository<Poll, Long> {
    Optional<Poll> findByTitle(String title);

    long deleteByTitle(String title);

    List<PollSummary> findAllByExpiresAtAfterOrderByCreatedAtDesc(Instant now);
    List<PollSummary> findAllByExpiresAtBeforeOrderByCreatedAtDesc(Instant now);
}
