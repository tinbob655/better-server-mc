package world.betterserver.server.model.dto.response.auth;

import world.betterserver.server.model.entity.user.Permission;

import java.util.Set;

public record CurrentUserResponse(String username, Set<Permission> permissions) {
}
