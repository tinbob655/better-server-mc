package world.betterserver.server.controller.news;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.news.DeleteNewsRequest;
import world.betterserver.server.model.dto.request.news.NewNewsRequest;
import world.betterserver.server.model.dto.response.news.NewsResponse;
import world.betterserver.server.model.entity.news.News;
import world.betterserver.server.model.entity.news.NewsRepository;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;

import java.security.Principal;
import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class NewsController implements NewsControllerTemplate {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    @Override
    public List<NewsResponse> getAllNews() {
        return this.newsRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(n -> new NewsResponse(
                        n.getTitle(),
                        n.getBody(),
                        n.getCreatedBy().getUsername(),
                        n.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public ResponseEntity<?> addNews(NewNewsRequest request, Principal principal) {

        //find the user who created the user
        String username = principal.getName();
        User creator = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Could not find a user with name: " + username)
        );
        News newNews = new News();
        newNews.setTitle(request.title());
        newNews.setBody(request.body());
        newNews.setCreatedAt(Instant.now());
        newNews.setCreatedBy(creator);

        this.newsRepository.save(newNews);
        return ResponseEntity.ok().build();
    }

    @Override
    @Transactional
    public ResponseEntity<?> deleteNews(DeleteNewsRequest request) {
        long deleteCount = this.newsRepository.deleteByTitle(request.title());
        if (deleteCount > 0) {
            return ResponseEntity.ok().build();
        }
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not find a news item with name: " + request.title());
    }
}
