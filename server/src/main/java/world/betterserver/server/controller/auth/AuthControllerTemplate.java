package world.betterserver.server.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.AccountRequest;
import world.betterserver.server.model.dto.request.ChangePasswordRequest;
import world.betterserver.server.model.dto.response.CurrentUserResponse;
import world.betterserver.server.model.dto.response.LoginResponse;

@RequestMapping("/api/auth")
public interface AuthControllerTemplate {

    @PostMapping("/register")
    ResponseEntity<?> register(@RequestBody AccountRequest request);

    @PostMapping("/login")
    ResponseEntity<LoginResponse> login(@RequestBody AccountRequest request);

    @GetMapping("/me")
    ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication auth);

    //only allow a dev or the account owner to change their own password
    //'#username' reads the @PathVariable called 'username'
    @PreAuthorize("#username == authentication.name or hasAuthority('DEV')")
    @PutMapping("/users/{username}/password")
    ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody ChangePasswordRequest request);
}
