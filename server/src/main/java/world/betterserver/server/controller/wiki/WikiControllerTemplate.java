package world.betterserver.server.controller.wiki;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.wiki.NewWikiPostRequest;
import world.betterserver.server.model.dto.response.wiki.WikiPost;
import world.betterserver.server.model.dto.response.wiki.WikiSummary;

import java.security.Principal;
import java.util.List;

@RequestMapping("/api/wiki")
public interface WikiControllerTemplate {

    @GetMapping("/all")
    List<WikiSummary> getWikiSummaries();

    @GetMapping("/{title}")
    WikiPost getDetailedPost(@PathVariable String title);

    @PostMapping
    ResponseEntity<?> addWikiPost(@RequestBody @Valid NewWikiPostRequest request, Principal principal);

    @DeleteMapping("/{title}")
    ResponseEntity<?> deleteWikiPost(@PathVariable String title, Authentication authentication);
}
