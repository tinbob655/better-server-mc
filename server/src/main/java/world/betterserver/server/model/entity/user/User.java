package world.betterserver.server.model.entity.user;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column
    private String profilePictureFileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Permission permission = Permission.DEFAULT;

    protected User() {}

    public User(String username, String passwordHash, String profilePictureFileName) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.profilePictureFileName = profilePictureFileName;
    }
}
