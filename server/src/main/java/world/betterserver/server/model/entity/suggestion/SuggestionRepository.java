package world.betterserver.server.model.entity.suggestion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    Optional<Suggestion> findByTitle(String title);

    List<Suggestion> findAllByOrderByCreatedAtDesc();
    List<Suggestion> findAllByStatusInOrderByCreatedAtDesc(Collection<SuggestionStatus> statuses);
}
