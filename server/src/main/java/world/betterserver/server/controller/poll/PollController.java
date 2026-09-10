package world.betterserver.server.controller.poll;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RestController;
import world.betterserver.server.model.dto.request.poll.NewPollOptionRequest;
import world.betterserver.server.model.dto.request.poll.NewPollRequest;
import world.betterserver.server.model.dto.response.auth.UserSummary;
import world.betterserver.server.model.dto.response.poll.DetailedPoll;
import world.betterserver.server.model.dto.response.poll.PollSummary;
import world.betterserver.server.model.entity.poll.Poll;
import world.betterserver.server.model.entity.poll.PollOption;
import world.betterserver.server.model.entity.poll.PollRepository;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class PollController implements PollControllerTemplate {

    private final PollRepository pollRepository;
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
    @Transactional
    public DetailedPoll getDetailedPoll(String title) {
        Poll poll = this.pollRepository.findByTitle(title).orElseThrow(
                () -> new NoSuchElementException("Could not find a poll with title: " + title)
        );
        List<DetailedPoll.PollOption> options = poll.getOptions().stream()
                .map(option -> new DetailedPoll.PollOption(
                        option.getName(),
                        option.getColor(),
                        option.getVoters().stream()
                                .map(voter -> new UserSummary(
                                        voter.getUsername(),
                                        voter.getPermission()
                                )).collect(Collectors.toSet())
                )).toList();
        return new DetailedPoll(
                poll.getTitle(),
                poll.getCreatedAt(),
                poll.getExpiresAt(),
                poll.isAnonymous(),
                poll.isAllowMultipleResponses(),
                options
        );
    }

    @Override
    public ResponseEntity<?> addPoll(NewPollRequest request) {
        Poll newPoll = new Poll();
        newPoll.setTitle(request.title());
        newPoll.setAnonymous(request.anonymous());
        newPoll.setCreatedAt(Instant.now());
        newPoll.setExpiresAt(request.expiresAt());
        newPoll.setAllowMultipleResponses(request.allowMultipleResponses());

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

        //validate that the requested option is in the poll
        Poll poll = this.pollRepository.findByTitle(pollTitle).orElseThrow(
                () -> new NoSuchElementException("Could not find a poll with name: " + pollTitle)
        );
        PollOption option = poll.getOptions().stream()
                .filter(op -> op.getName().equals(optionName))
                .findAny()
                .orElseThrow(
                        () -> new NoSuchElementException("Poll '" + pollTitle + "' does not contain option '" + optionName + "'.")
                );

        //validate the user
        String username = principal.getName();
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Could not find a user with name: " + username)
        );

        this.handleVoting(poll, option, user);
        this.pollRepository.save(poll);
        return ResponseEntity.ok().build();
    }

    @Override
    @Transactional
    public ResponseEntity<?> deletePoll(String title) {
        long deleteCount = this.pollRepository.deleteByTitle(title);
        if (deleteCount > 0) {
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find poll with title: " + title);
        }
    }

    private void handleVoting(Poll poll, PollOption chosenOption, User user) {

        //user already voted for this option so remove the vote
        if (chosenOption.getVoters().contains(user)) {
            chosenOption.removeVoter(user);
            return;
        }

        //in a single-response poll, remove what the user had already voted for
        if (!poll.isAllowMultipleResponses()) {
            poll.getOptions().stream()
                    .filter(op -> op.getVoters().contains(user))
                    .findAny()
                    .ifPresent(previous -> previous.removeVoter(user));
        }

        //single or multiple response polls always need the user to vote for the user option
        chosenOption.addVoter(user);
    }
}
