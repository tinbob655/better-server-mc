package world.betterserver.server.model.entity.news;

import jakarta.persistence.*;
import lombok.Data;
import world.betterserver.server.model.entity.user.User;

import java.time.Instant;

@Entity
@Table(name = "news")
@Data
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User createdBy;
}
