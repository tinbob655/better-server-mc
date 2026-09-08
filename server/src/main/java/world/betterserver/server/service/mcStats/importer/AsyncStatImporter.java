package world.betterserver.server.service.mcStats.importer;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStatRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AsyncStatImporter {

    private final McPlayerStatRepository playerStatRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Async("mcStatImportExecutor")
    @Transactional
    public CompletableFuture<List<McPlayerStat>> importPlayerFile(@NonNull Path file) {

        //the filename (minus extension) is the player's UUID
        String fileName = file.getFileName().toString();
        UUID playerUuid = UUID.fromString(fileName.substring(0, fileName.length() - ".json".length()));

        try {
            Instant fileModifiedAt = Files.getLastModifiedTime(file).toInstant();

            //if the time of import is the same then we can just skip entirely
            Optional<McPlayerStat> existingSample = this.playerStatRepository.findFirstByPlayerUuid(playerUuid);
            if (existingSample.isPresent() && !fileModifiedAt.isAfter(existingSample.get().getUpdatedAt())) {
                return CompletableFuture.completedFuture(null);
            }

            JsonNode root = this.objectMapper.readTree(file.toFile());
            JsonNode stats = root.get("stats");
            if (stats == null) return CompletableFuture.completedFuture(null);

            //load every stat about this player
            Map<String, McPlayerStat> existingStats = this.playerStatRepository.findAllByPlayerUuid(playerUuid).stream()
                    .collect(Collectors.toMap(McPlayerStat::getStatKey, stat -> stat));

            //vanilla nests stats two levels deep: statisticType -> statisticName -> value
            for (String statType : stats.propertyNames()) {
                JsonNode statsOfType = stats.get(statType);

                for (Map.Entry<String, JsonNode> entry : statsOfType.properties()) {
                    String statKey = statType + ":" + entry.getKey();

                    McPlayerStat playerStat = existingStats.computeIfAbsent(statKey, key -> {
                        McPlayerStat created = new McPlayerStat();
                        created.setPlayerUuid(playerUuid);
                        created.setStatKey(key);
                        return created;
                    });

                    playerStat.setStatValue(entry.getValue().asLong());
                    playerStat.setUpdatedAt(fileModifiedAt);
                }
            }

            return CompletableFuture.completedFuture(List.copyOf(existingStats.values()));
        }
        catch (IOException e) {
            System.err.println("mcstats: failed to read " + file + " - " + e.getMessage());
            return CompletableFuture.completedFuture(List.of());
        }
    }
}
