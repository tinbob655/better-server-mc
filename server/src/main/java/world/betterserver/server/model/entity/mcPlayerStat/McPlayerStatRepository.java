package world.betterserver.server.model.entity.mcPlayerStat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface McPlayerStatRepository extends JpaRepository<McPlayerStat, Long> {
    List<McPlayerStat> findAllByStatKeyOrderByStatValueDesc(String statKey);
    List<McPlayerStat> findAllByStatKeyIn(Collection<String> statKeys);
    Optional<McPlayerStat> findFirstByPlayerUuid(UUID playerUuid);
    Set<McPlayerStat> findAllByPlayerUuid(UUID playerUuid);

    @Query("SELECT DISTINCT p.playerUuid FROM McPlayerStat p")
    Set<UUID> findAllPlayerUuids();

    @Query("""
        SELECT p.playerUuid
        FROM McPlayerStat p
        WHERE p.statKey = :statKey
        ORDER BY p.statValue DESC
""")
    List<UUID> findUuidByStatKeyOrderByStatValueDesc(String statKey);
}
