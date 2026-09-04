package world.betterserver.server.controller.auth;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.auth.AccountRequest;
import world.betterserver.server.model.dto.request.auth.ChangePasswordRequest;
import world.betterserver.server.model.dto.request.auth.ChangePermissionRequest;
import world.betterserver.server.model.dto.response.auth.CurrentUserResponse;
import world.betterserver.server.model.dto.response.auth.LoginResponse;
import world.betterserver.server.model.dto.response.auth.UserSummary;
import world.betterserver.server.model.entity.user.Permission;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;
import world.betterserver.server.service.jwt.JwtService;
import world.betterserver.server.service.nofitication.NotificationService;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthControllerTemplate {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final NotificationService notifier;

    @Override
    public ResponseEntity<?> register(AccountRequest request) {
        if (this.userRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }

        User user = new User(request.username(), this.encoder.encode(request.password()));
        this.userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<LoginResponse> login(AccountRequest request) {
        try {
            Authentication auth = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            return ResponseEntity.ok(new LoginResponse(this.jwtService.generateToken(auth.getName())));
        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @Override
    public ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication auth) {
        Set<Permission> permissions = auth.getAuthorities().stream()
                .map(a -> Permission.valueOf(a.getAuthority()))
                .collect(Collectors.toSet());
        return ResponseEntity.ok(new CurrentUserResponse(auth.getName(), permissions));
    }

    @Override
    public ResponseEntity<?> changePassword(String username, ChangePasswordRequest request) {
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("No user found for name: " + username)
        );

        //verify old password is correct
        if (this.encoder.matches(request.oldPassword(), user.getPasswordHash())) {

            //update password
            user.setPasswordHash(this.encoder.encode(request.newPassword()));
            this.userRepository.save(user);
            return ResponseEntity.ok().build();
        }
        else {

            //incorrect old password
            return ResponseEntity.badRequest().body("Old password was incorrect");
        }
    }

    @Override
    public Set<UserSummary> getAllUsers() {
        return this.userRepository.findAll().stream()
                .map(usr -> new UserSummary(usr.getUsername(), usr.getPermission()))
                .collect(Collectors.toSet());
    }

    @Override
    public ResponseEntity<?> changePermissionLevel(String username, ChangePermissionRequest request) {
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("No user found for name: " + username)
        );
        Permission oldPermission = user.getPermission();
        Permission newPermission = request.newPermission();
        user.setPermission(newPermission);

        //save & notify discord
        this.userRepository.save(user);
        this.notifier.notifyDiscord("The permissions of user "
                + username
                + " were changed from "
                + oldPermission
                + " to "
                + newPermission);
        return ResponseEntity.ok().build();
    }
}
