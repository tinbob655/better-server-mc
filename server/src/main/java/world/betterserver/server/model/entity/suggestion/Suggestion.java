package world.betterserver.server.model.entity.suggestion;

import jakarta.persistence.*;
import lombok.Data;
import world.betterserver.server.model.entity.user.User;

import java.time.Instant;

@Entity
@Table(name="suggestion")
@Data
public class Suggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column
    private String adminResponse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SuggestionStatus status;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Instant createdAt;
}
