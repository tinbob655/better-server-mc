package world.betterserver.server.controller.news;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.news.DeleteNewsRequest;
import world.betterserver.server.model.dto.request.news.NewNewsRequest;
import world.betterserver.server.model.dto.response.news.NewsResponse;

import java.security.Principal;
import java.util.List;

@RequestMapping("/api/news")
public interface NewsControllerTemplate {

    @GetMapping
    List<NewsResponse> getAllNews();

    @PostMapping
    @PreAuthorize("hasAuthority('DEV')")
    ResponseEntity<?> addNews(@RequestBody @Valid NewNewsRequest request, Principal principal);

    @DeleteMapping
    @PreAuthorize("hasAuthority('DEV')")
    ResponseEntity<?> deleteNews(@RequestBody @Valid DeleteNewsRequest request);
}
