package world.betterserver.server.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.AccountRequest;
import world.betterserver.server.model.dto.response.CurrentUserResponse;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;

@RestController
@RequiredArgsConstructor
public final class AuthController implements AuthControllerTemplate {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;

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
    public ResponseEntity<?> login(AccountRequest request, HttpServletRequest httpRequest) {
        try {

            //authentication manager automatically uses UserDetailService and PasswordEncoder
            Authentication auth = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            //stores the authenticated user
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            //persist the user's session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            return ResponseEntity.ok().build();
        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @Override
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //invalidate the user's session so they are not remembered
        new SecurityContextLogoutHandler().logout(request, response, auth);

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication auth) {
        return ResponseEntity.ok(new CurrentUserResponse(auth.getName()));
    }
}
