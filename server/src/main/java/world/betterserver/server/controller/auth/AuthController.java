package world.betterserver.server.controller.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.AccountRegisterRequest;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;

@RestController
@RequiredArgsConstructor
public final class AuthController implements AuthControllerTemplate {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public ResponseEntity<?> register(AccountRegisterRequest request) {
        if (this.userRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }

        User user = new User(request.username(), this.encoder.encode(request.password()));
        this.userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}
