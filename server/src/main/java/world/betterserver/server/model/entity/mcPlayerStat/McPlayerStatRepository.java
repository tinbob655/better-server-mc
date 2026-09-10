package world.betterserver.server.model.entity.mcPlayerStat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface McPlayerStatRepository extends JpaRepository<McPlayerStat, Long> {
    List<McPlayerStat> findAllByStatKeyOrderByStatValueDesc(String statKey);
    Optional<McPlayerStat> findFirstByPlayerUuid(UUID playerUuid);
    Set<McPlayerStat> findAllByPlayerUuid(UUID playerUuid);

    @Query("SELECT DISTINCT p.playerUuid FROM McPlayerStat p")
    Set<UUID> findAllPlayerUuids();
}
