package world.betterserver.server.model.entity.poll;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import world.betterserver.server.model.entity.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "poll_option")
@Data
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String color;

    @Column(nullable = false)
    private int votes = 0;

    @ManyToOne
    @JoinColumn(name = "poll_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Poll poll;

    @ManyToMany
    private Set<User> voters = new HashSet<>();

    public void addVoter(User voter) {
        this.voters.add(voter);
        this.votes++;
    }

    public void removeVoter(User voter) {
        this.voters.remove(voter);
        this.votes--;
    }
}
