package world.betterserver.server.model.entity.wiki;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WikiRepository extends JpaRepository<Wiki, Long> {
    Optional<Wiki> findByTitle(String title);
    List<Wiki> findAllByOrderByCreatedAtDesc();
}
