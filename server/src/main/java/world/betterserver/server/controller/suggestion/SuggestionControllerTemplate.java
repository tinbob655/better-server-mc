package world.betterserver.server.controller.suggestion;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.suggestion.ChangeAdminResponseRequest;
import world.betterserver.server.model.dto.request.suggestion.ChangeStatusRequest;
import world.betterserver.server.model.dto.request.suggestion.DeleteSuggestionRequest;
import world.betterserver.server.model.dto.request.suggestion.NewSuggestionRequest;
import world.betterserver.server.model.dto.response.suggestion.SuggestionResponse;

import java.security.Principal;
import java.util.List;

@RequestMapping("/api/suggestion")
public interface SuggestionControllerTemplate {

    @GetMapping("/open")
    List<SuggestionResponse> getOpenSuggestions();

    @GetMapping("/all")
    List<SuggestionResponse> getAllSuggestions();

    @PostMapping
    ResponseEntity<?> addSuggestion(@RequestBody @Valid NewSuggestionRequest request, Principal principal);

    @PatchMapping("/status")
    ResponseEntity<?> changeStatus(@RequestBody @Valid ChangeStatusRequest request);

    @PreAuthorize("hasAuthority('DEV')")
    @PatchMapping("/adminResponse")
    ResponseEntity<?> changeAdminResponse(@RequestBody @Valid ChangeAdminResponseRequest request);

    @DeleteMapping
    ResponseEntity<?> deleteSuggestion(@RequestBody @Valid DeleteSuggestionRequest request, Authentication authentication);
}
