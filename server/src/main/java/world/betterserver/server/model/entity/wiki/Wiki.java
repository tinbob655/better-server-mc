package world.betterserver.server.model.entity.wiki;

import jakarta.persistence.*;
import lombok.Data;
import world.betterserver.server.model.entity.user.User;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

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
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User createdBy;

    @ManyToMany
    @JoinTable(
            name = "wiki_upvoters",
            joinColumns = @JoinColumn(name = "wiki_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> upvoters = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "wiki_downvoters",
            joinColumns = @JoinColumn(name = "wiki_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> downvoters = new HashSet<>();

    public void upvote(User user) {
        downvoters.remove(user);
        upvoters.add(user);
    }

    public void downvote(User user) {
        upvoters.remove(user);
        downvoters.add(user);
    }

    public void removeUpvote(User user) {
        upvoters.remove(user);
    }

    public void removeDownvote(User user) {
        downvoters.remove(user);
    }
}
