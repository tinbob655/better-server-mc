package world.betterserver.server.model.dto.response.auth;

import world.betterserver.server.model.entity.user.Permission;

public record UserSummary(String username, Permission maxPermissionLevel) {
}
