package world.betterserver.server.model.entity.user;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
public enum Permission implements GrantedAuthority {
    DEFAULT(0),
    DEV(10);

    private final int level;

    Permission(int level) {
        this.level = level;
    }

    @Override
    public String getAuthority() {
        return name();
    }
}
