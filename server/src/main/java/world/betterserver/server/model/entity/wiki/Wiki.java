package world.betterserver.server.model.entity.wiki;

import jakarta.persistence.*;
import lombok.Data;
import world.betterserver.server.model.entity.user.User;

import java.time.Instant;

@Entity
@Table(name = "wiki")
@Data
public class Wiki {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private int upvotes;

    @Column(nullable = false)
    private int downvotes;

    @Column(nullable = false)
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User createdBy;
}
