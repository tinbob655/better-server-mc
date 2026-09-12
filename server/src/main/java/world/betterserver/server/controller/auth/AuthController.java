package world.betterserver.server.controller.auth;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
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
import world.betterserver.server.service.nofitication.NotificationServiceImpl;
import world.betterserver.server.service.profilePicture.ProfilePictureService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthControllerTemplate {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final NotificationServiceImpl notifier;
    private final ProfilePictureService profilePictureService;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    @Value("${jwt.cookie.secure:true}")
    private boolean cookieSecure;

    @Override
    public ResponseEntity<?> checkAuth() {
        //an unauthorised user won't make it this far
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> register(AccountRequest request, MultipartFile profilePicture) {
        if (this.userRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }

        try {
            String filename = this.profilePictureService.store(request.username(), profilePicture);
            String passwordHash = this.encoder.encode(request.password());
            User user = new User(request.username(), passwordHash, filename);
            this.userRepository.save(user);
            return ResponseEntity.ok().build();
        }
        catch (IOException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save profile picture");
        }
    }

    @Override
    public ResponseEntity<LoginResponse> login(AccountRequest request) {
        try {
            Authentication auth = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            String token = this.jwtService.generateToken(auth.getName());

            ResponseCookie cookie = ResponseCookie.from("authToken", token)
                    .httpOnly(true)
                    .secure(this.cookieSecure)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(this.expirationMs / 1000)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponse(token));
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
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(this.cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)  //browser will delete the cookie
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
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
    public ResponseEntity<?> updateProfilePicture(String username, MultipartFile file) {
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("No user found for name: " + username)
        );
        try {
            this.profilePictureService.delete(user.getProfilePictureFileName());
            user.setProfilePictureFileName(this.profilePictureService.store(username, file));
            this.userRepository.save(user);
            return ResponseEntity.ok().build();
        }
        catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (IOException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save profile picture");
        }
    }

    @Override
    public ResponseEntity<?> getProfilePicture(String username) {
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("No user found for name: " + username)
        );
        if (user.getProfilePictureFileName() == null) return ResponseEntity.notFound().build();

        try {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                    .body(this.profilePictureService.load(user.getProfilePictureFileName()));
        }
        catch (MalformedURLException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.notFound().build();
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
