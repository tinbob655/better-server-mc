package world.betterserver.server.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import world.betterserver.server.model.dto.request.AccountRegisterRequest;

@RequestMapping("/api/auth")
public sealed interface AuthControllerTemplate permits AuthController {

    @PostMapping("/register")
    ResponseEntity<?> register(@RequestBody AccountRegisterRequest request);
}
