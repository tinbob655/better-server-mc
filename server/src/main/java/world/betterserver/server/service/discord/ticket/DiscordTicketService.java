package world.betterserver.server.service.discord.ticket;

public interface DiscordTicketService {

    String issueTicket();
    boolean isValid(String ticket);
}
