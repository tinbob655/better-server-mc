package world.betterserver.server.controller.poll;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.poll.NewPollOptionRequest;
import world.betterserver.server.model.dto.request.poll.NewPollRequest;
import world.betterserver.server.model.dto.response.poll.DetailedPoll;
import world.betterserver.server.model.dto.response.poll.PollSummary;
import world.betterserver.server.model.entity.poll.Poll;
import world.betterserver.server.model.entity.poll.PollOption;
import world.betterserver.server.model.entity.poll.PollOptionRepository;
import world.betterserver.server.model.entity.poll.PollRepository;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
public class PollController implements PollControllerTemplate {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final UserRepository userRepository;

    @Override
    public List<PollSummary> getFuturePollSummaries() {
        return this.pollRepository.findAllByExpiresAtAfterOrderByCreatedAtDesc(Instant.now());
    }

    @Override
    public List<PollSummary> getPastPollSummaries() {
        return this.pollRepository.findAllByExpiresAtBeforeOrderByCreatedAtDesc(Instant.now());
    }

    @Override
    public DetailedPoll getDetailedPoll(String title) {
        return null;
    }

    @Override
    public ResponseEntity<?> addPoll(NewPollRequest request) {
        Poll newPoll = new Poll();
        newPoll.setTitle(request.title());
        newPoll.setAnonymous(request.anonymous());
        newPoll.setCreatedAt(Instant.now());
        newPoll.setExpiresAt(request.expiresAt());

        //work out default poll options and add them
        request.defaultOptions()
                .forEach(op -> newPoll.addPollOption(op.name(), op.color()));

        this.pollRepository.save(newPoll);
        return ResponseEntity.ok().build();
    }

    @Override
    @Transactional
    public ResponseEntity<?> addPollOption(String pollTitle, NewPollOptionRequest request) {
        Poll poll = this.pollRepository.findByTitle(pollTitle).orElseThrow(
                () -> new NoSuchElementException("Could not find a poll with title: " + pollTitle)
        );
        poll.addPollOption(request.name(), request.color());
        this.pollRepository.save(poll);
        return ResponseEntity.ok().build();
    }

    @Override
    @Transactional
    public ResponseEntity<?> deletePollOption(String pollTitle, String optionName) {
        Poll poll = this.pollRepository.findByTitle(pollTitle).orElseThrow(
                () -> new NoSuchElementException("Could not find a poll with title: "+  pollTitle)
        );
        boolean removed = poll.removePollOption(optionName);
        this.pollRepository.save(poll);

        if (removed) {
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find an option named: " + optionName);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> voteForOptionInPoll(String pollTitle, String optionName, Principal principal) {
        PollOption optionToToggle = this.pollOptionRepository.findByPollTitleAndName(pollTitle, optionName).orElseThrow(
                () -> new NoSuchElementException("Could find option '" + optionName + "' in poll '" + pollTitle + "'")
        );
        String username = principal.getName();
        User voter = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Could not find user with name: " + username)
        );

        if (optionToToggle.getVoters().contains(voter)) {
            optionToToggle.removeVoter(voter);
        }
        else {
            optionToToggle.addVoter(voter);
        }
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> deletePoll(String title) {
        long deleteCount = this.pollRepository.deleteByTitle(title);
        if (deleteCount > 0) {
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find poll with title: " + title);
        }
    }
}
