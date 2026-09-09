package world.betterserver.server.model.entity.poll;

import jakarta.persistence.*;
import lombok.Data;

import java.awt.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "poll")
@Data
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean anonymous;

    @OneToMany(
            mappedBy = "poll",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PollOption> options = new ArrayList<>();

    public void addPollOption(String optionName, String optionColor) {
        PollOption option = new PollOption();
        option.setName(optionName);
        option.setColor(optionColor);
        option.setPoll(this);

        this.options.add(option);
    }

    public boolean removePollOption(String optionName) {
        return this.options.removeIf(o -> o.getName().equals(optionName));
    }
}
