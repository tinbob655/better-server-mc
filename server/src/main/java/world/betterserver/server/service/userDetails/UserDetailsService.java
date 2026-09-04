package world.betterserver.server.service.userDetails;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import world.betterserver.server.model.entity.user.Permission;
import world.betterserver.server.model.entity.user.User;
import world.betterserver.server.model.entity.user.UserRepository;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@org.jspecify.annotations.NonNull String username) throws UsernameNotFoundException {
        User user = this.userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found for name: " + username));

        //a user has all permissions lower than or equal to their saved newPermission (highest will always be saved)
        List<Permission> grantedPermissions = Arrays.stream(Permission.values())
                .filter(p -> p.getLevel() <= user.getPermission().getLevel())
                .toList();

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .disabled(false)
                .authorities(grantedPermissions)
                .build();
    }
}
