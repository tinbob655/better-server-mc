package world.betterserver.server.controller.wiki;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.wiki.NewWikiPostRequest;
import world.betterserver.server.model.dto.response.wiki.WikiPost;
import world.betterserver.server.model.dto.response.wiki.WikiSummary;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;
import world.betterserver.server.model.entity.wiki.Wiki;
import world.betterserver.server.model.entity.wiki.WikiRepository;
import world.betterserver.server.service.htmlSanitiser.HtmlSanitiserService;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class WikiController implements WikiControllerTemplate {

    private final WikiRepository wikiRepository;
    private final UserRepository userRepository;
    private final HtmlSanitiserService sanitiser;

    @Override
    public List<WikiSummary> getWikiSummaries() {
        return this.wikiRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(w -> new WikiSummary(
                        w.getTitle(),
                        w.getCreatedBy().getUsername(),
                        w.getCreatedAt(),
                        w.getUpvoters().stream().map(User::getUsername).collect(Collectors.toSet()),
                        w.getDownvoters().stream().map(User::getUsername).collect(Collectors.toSet())
                ))
                .toList();
    }

    @Override
    public WikiPost getDetailedPost(String title) {
        Wiki wiki = this.wikiRepository.findByTitle(title).orElseThrow(
                () -> new NoSuchElementException("Could not find a wiki post with title: " + title)
        );
        return new WikiPost(
                wiki.getTitle(),
                wiki.getBody(),
                wiki.getCreatedAt(),
                wiki.getCreatedBy().getUsername(),
                wiki.getUpvoters().stream().map(User::getUsername).collect(Collectors.toSet()),
                wiki.getDownvoters().stream().map(User::getUsername).collect(Collectors.toSet())
        );
    }

    @Override
    public ResponseEntity<?> addWikiPost(NewWikiPostRequest request, Principal principal) {
        Wiki newWiki = new Wiki();
        newWiki.setTitle(request.title());
        newWiki.setCreatedAt(Instant.now());
        newWiki.setBody(this.sanitiser.sanitise(request.body()));

        String username = principal.getName();
        User poster = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Could not find user with name: " + username)
        );
        newWiki.setCreatedBy(poster);

        this.wikiRepository.save(newWiki);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> upvoteWikiPost(String title, Principal principal) {
        Wiki wiki = this.wikiRepository.findByTitle(title).orElseThrow(
                () -> new NoSuchElementException("Could not find a wiki post with title: " + title)
        );

        String username = principal.getName();
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Could not find a user with name: " + username)
        );

        wiki.removeDownvote(user);
        wiki.upvote(user);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> downvoteWikiPost(String title, Principal principal) {
        Wiki wiki = this.wikiRepository.findByTitle(title).orElseThrow(
                () -> new NoSuchElementException("Could not find a wiki post with title: " + title)
        );

        String username = principal.getName();
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Could not find a user with name: " + username)
        );

        wiki.removeUpvote(user);
        wiki.downvote(user);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> deleteWikiPost(String title, Authentication authentication) {

        Wiki wikiToDelete = this.wikiRepository.findByTitle(title).orElseThrow(
                () -> new NoSuchElementException("Could not find a wiki post with title: " + title)
        );

        //only the poster of the wiki / a dev can delete stuff
        boolean isOwner = wikiToDelete.getCreatedBy().getUsername().equals(authentication.getName());
        boolean isDev = authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "DEV"));
        if (isOwner || isDev) {
            this.wikiRepository.delete(wikiToDelete);
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You may only delete wiki posts you own.");
        }
    }
}
