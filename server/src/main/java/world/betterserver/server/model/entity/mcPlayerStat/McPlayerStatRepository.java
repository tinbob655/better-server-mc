package world.betterserver.server.model.entity.mcPlayerStat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.*;

public interface McPlayerStatRepository extends JpaRepository<McPlayerStat, Long> {
    List<McPlayerStat> findAllByStatKeyOrderByStatValueDesc(String statKey);
    List<McPlayerStat> findAllByStatKeyIn(Collection<String> statKeys);
    Optional<McPlayerStat> findFirstByPlayerUuid(UUID playerUuid);
    Set<McPlayerStat> findAllByPlayerUuid(UUID playerUuid);

    @Query("SELECT DISTINCT p.playerUuid FROM McPlayerStat p")
    Set<UUID> findAllPlayerUuids();

    @Query("""
        SELECT p.playerUuid AS playerUuid, COALESCE(SUM(p.statValue), 0) AS TOTAL, MAX(p.updatedAt) AS updatedAt
        FROM McPlayerStat p
        WHERE p.statKey LIKE CONCAT(:categoryPrefix, '%')
        GROUP BY p.playerUuid
        ORDER BY SUM(p.statValue) DESC
""")
    List<CategoryTotal> findTotalsByCategoryPrefix(String categoryPrefix);

    interface CategoryTotal {
        UUID getPlayerUuid();
        Long getTotal();
        Instant getUpdatedAt();
    }
}
