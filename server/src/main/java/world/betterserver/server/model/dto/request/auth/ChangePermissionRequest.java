package world.betterserver.server.model.dto.request.auth;

import jakarta.validation.constraints.NotNull;
import world.betterserver.server.model.entity.user.Permission;

public record ChangePermissionRequest(

        @NotNull(message = "New permission is required")
        Permission newPermission
) {
}
