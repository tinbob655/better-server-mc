package world.betterserver.server.controller.poll;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import world.betterserver.server.model.dto.request.poll.NewPollOptionRequest;
import world.betterserver.server.model.dto.request.poll.NewPollRequest;
import world.betterserver.server.model.dto.response.poll.DetailedPoll;
import world.betterserver.server.model.dto.response.poll.PollSummary;

import java.security.Principal;
import java.util.List;

@RequestMapping("/api/poll")
public interface PollControllerTemplate {

    @GetMapping("/summaries/future")
    List<PollSummary> getFuturePollSummaries();

    @GetMapping("/summaries/past")
    List<PollSummary> getPastPollSummaries();

    @GetMapping("/detailed/{title}")
    DetailedPoll getDetailedPoll(@PathVariable String title);

    @PostMapping("/addPoll")
    @PreAuthorize("hasAuthority('DEV')")
    ResponseEntity<?> addPoll(@RequestBody @Valid NewPollRequest request);

    @PostMapping("/addOption/{pollTitle}")
    @PreAuthorize("hasAuthority('DEV')")
    ResponseEntity<?> addPollOption(@PathVariable String pollTitle, @RequestBody @Valid NewPollOptionRequest request);

    @DeleteMapping("/deleteOption/{pollTitle}/{optionName}")
    @PreAuthorize("hasAuthority('DEV')")
    ResponseEntity<?> deletePollOption(@PathVariable String pollTitle, @PathVariable String optionName);

    //must toggle a user voting for the option
    @PatchMapping("/voteFor/{pollTitle}/{optionName}")
    ResponseEntity<?> voteForOptionInPoll(@PathVariable String pollTitle, @PathVariable String optionName, Principal principal);

    @DeleteMapping("/deletePoll/{title}")
    @PreAuthorize("hasAuthority('DEV')")
    ResponseEntity<?> deletePoll(@PathVariable String title);
}
