package world.betterserver.server.service.discord.ticket;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class DiscordTicketServiceImpl implements DiscordTicketService {

    @Value("${discord.ticket.secret}")
    private String secret;

    @Value("${discord.ticket.expiration-ms}")
    private long expirationMs;

    private SecretKey key;

    @PostConstruct
    private void getKey() {
        this.key = Keys.hmacShaKeyFor(this.secret.getBytes());
    }

    @Override
    public String issueTicket() {
        Date now = new Date();
        return Jwts.builder()
                .subject("discord-verified")
                .issuedAt(now)
                .expiration(new Date(now.getTime() + this.expirationMs))
                .signWith(this.key)
                .compact();
    }

    @Override
    public boolean isValid(String ticket) {
        try {
            Jwts.parser().verifyWith(this.key).build().parseSignedClaims(ticket);
            return true;
        }
        catch (Exception e) {

            //covers missing/malformed/expired/tampered tickets
            return false;
        }
    }
}
