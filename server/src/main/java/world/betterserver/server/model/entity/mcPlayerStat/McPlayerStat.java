package world.betterserver.server.model.entity.mcPlayerStat;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "player_stat", uniqueConstraints = @UniqueConstraint(columnNames = {"playerUuid", "statKey"}))
@Data
public class McPlayerStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID playerUuid;

    @Column(nullable = false)
    private String statKey;

    @Column(nullable = false)
    private long statValue;

    @Column(nullable = false)
    private Instant updatedAt;
}
