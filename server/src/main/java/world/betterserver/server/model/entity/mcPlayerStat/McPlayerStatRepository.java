package world.betterserver.server.model.entity.mcPlayerStat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface McPlayerStatRepository extends JpaRepository<McPlayerStat, Long> {
    Optional<McPlayerStat> findFirstByPlayerUuid(String playerUuid);
    Set<McPlayerStat> findAllByPlayerUuid(String playerUuid);
}
