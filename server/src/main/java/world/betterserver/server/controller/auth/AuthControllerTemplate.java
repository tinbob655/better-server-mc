package world.betterserver.server.controller.auth;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.auth.AccountRequest;
import world.betterserver.server.model.dto.request.auth.ChangePasswordRequest;
import world.betterserver.server.model.dto.request.auth.ChangePermissionRequest;
import world.betterserver.server.model.dto.response.auth.CurrentUserResponse;
import world.betterserver.server.model.dto.response.auth.LoginResponse;
import world.betterserver.server.model.dto.response.auth.UserSummary;

import java.util.Set;

@RequestMapping("/api/auth")
public interface AuthControllerTemplate {

    @PostMapping("/register")
    ResponseEntity<?> register(@RequestBody @Valid AccountRequest request);

    @PostMapping("/login")
    ResponseEntity<LoginResponse> login(@RequestBody @Valid AccountRequest request);

    @GetMapping("/me")
    ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication auth);

    //only allow the account owner to edit their own password
    //'#username' reads the @PathVariable called 'username'
    @PreAuthorize("#username == authentication.name")
    @PutMapping("/users/{username}/password")
    ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody @Valid ChangePasswordRequest request);

    //allow devs to read all user's account info (no passwords)
    @PreAuthorize("hasAuthority('DEV')")
    @GetMapping("/allUsers")
    Set<UserSummary> getAllUsers();

    //allow devs to change account newPermission levels apart from their own
    @PreAuthorize("#username != authentication.name and hasAuthority('DEV')")
    @PutMapping("/users/{username}/permission")
    ResponseEntity<?> changePermissionLevel(@PathVariable String username, @RequestBody @Valid ChangePermissionRequest request);
}
