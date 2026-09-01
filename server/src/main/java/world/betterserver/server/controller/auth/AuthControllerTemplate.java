package world.betterserver.server.controller.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import world.betterserver.server.model.dto.request.AccountRequest;
import world.betterserver.server.model.dto.response.CurrentUserResponse;

@RequestMapping("/api/auth")
public sealed interface AuthControllerTemplate permits AuthController {

    @PostMapping("/register")
    ResponseEntity<?> register(@RequestBody AccountRequest request);

    @PostMapping("/login")
    ResponseEntity<?> login(@RequestBody AccountRequest request, HttpServletRequest httpRequest);

    @PostMapping("/logout")
    ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response);

    @GetMapping("/me")
    ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication auth);
}
