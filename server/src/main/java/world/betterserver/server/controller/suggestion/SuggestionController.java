package world.betterserver.server.controller.suggestion;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.suggestion.ChangeAdminResponseRequest;
import world.betterserver.server.model.dto.request.suggestion.ChangeStatusRequest;
import world.betterserver.server.model.dto.request.suggestion.DeleteSuggestionRequest;
import world.betterserver.server.model.dto.request.suggestion.NewSuggestionRequest;
import world.betterserver.server.model.dto.response.suggestion.SuggestionResponse;
import world.betterserver.server.model.entity.suggestion.Suggestion;
import world.betterserver.server.model.entity.suggestion.SuggestionRepository;
import world.betterserver.server.model.entity.suggestion.SuggestionStatus;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;
import world.betterserver.server.service.nofitication.NotificationService;


import java.security.Principal;
import java.time.Instant;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class SuggestionController implements SuggestionControllerTemplate {

    private final SuggestionRepository suggestionRepository;
    private final UserRepository userRepository;
    private final NotificationService notifier;

    @Override
    public List<SuggestionResponse> getOpenSuggestions() {
        Set<SuggestionStatus> openStatuses = Set.of(
                SuggestionStatus.UNSEEN,
                SuggestionStatus.ACCEPTED
        );
        return this.suggestionRepository.findAllByStatusInOrderByCreatedAtDesc(openStatuses).stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<SuggestionResponse> getAllSuggestions() {
        return this.suggestionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ResponseEntity<?> addSuggestion(NewSuggestionRequest request, Principal principal) {

        //make the suggestion
        Suggestion newSuggestion = new Suggestion();
        newSuggestion.setTitle(request.title());
        newSuggestion.setDescription(request.description());
        newSuggestion.setStatus(SuggestionStatus.UNSEEN);

        String username = principal.getName();
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () ->  new UsernameNotFoundException("No user found for name: " + username)
        );
        newSuggestion.setUser(user);
        newSuggestion.setCreatedAt(Instant.now());

        //save & notify discord
        this.suggestionRepository.save(newSuggestion);
        this.notifier.notifyDiscord("A new suggestion was created: " + request.title());

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> changeStatus(ChangeStatusRequest request) {
        Suggestion suggestion = this.suggestionRepository.findByTitle(request.suggestionTitle()).orElseThrow(
                () -> new NoSuchElementException("Could not find a suggestion with title: " + request.suggestionTitle())
        );
        suggestion.setStatus(request.newStatus());
        this.suggestionRepository.save(suggestion);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> changeAdminResponse(ChangeAdminResponseRequest request) {
        Suggestion suggestion = this.suggestionRepository.findByTitle(request.suggestionTitle()).orElseThrow(
                () -> new NoSuchElementException("Could not find a suggestion with title: " + request.suggestionTitle())
        );
        suggestion.setAdminResponse(request.adminResponse());
        this.suggestionRepository.save(suggestion);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> deleteSuggestion(DeleteSuggestionRequest request, Authentication authentication) {
        Suggestion suggestionToDelete = this.suggestionRepository.findByTitle(request.title()).orElseThrow(
                () -> new NoSuchElementException("Could not find a suggestion with title: " + request.title())
        );
        boolean isOwner = suggestionToDelete.getUser().getUsername().equals(authentication.getName());
        boolean isDev = authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "DEV"));
        if (isOwner || isDev) {
            this.suggestionRepository.delete(suggestionToDelete);
            return ResponseEntity.ok().build();
        }
        else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You may only delete posts you own.");
    }

    //helpers
    private SuggestionResponse convertToResponse(Suggestion suggestion) {
        return new SuggestionResponse(
                suggestion.getTitle(),
                suggestion.getDescription(),
                suggestion.getStatus(),
                suggestion.getAdminResponse(),
                suggestion.getUser().getUsername(),
                suggestion.getCreatedAt()
        );
    }
}
