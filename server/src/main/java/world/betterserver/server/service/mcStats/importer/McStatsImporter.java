package world.betterserver.server.service.mcStats.importer;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStat;
import world.betterserver.server.model.entity.mcPlayerStat.McPlayerStatRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class McStatsImporter {

    private final AsyncStatImporter importer;
    private final McPlayerStatRepository playerStatRepository;

    @Value("${mcstats.world-stats-directory}")
    private String statsDir;

    @Scheduled(fixedRateString = "${mcstats.import-interval-ms}")
    public void importStats() {
        Path statsPath = Paths.get(this.statsDir);
        if (!Files.isDirectory(statsPath)) {
            System.err.println("mcstats: stats directory not found at " + statsPath);
            return;
        }

        //parsing of player files will be done in parallel as it's expensive
        List<CompletableFuture<List<McPlayerStat>>> parseTasks;
        try (Stream<Path> files = Files.list(statsPath)) {
            parseTasks = files.filter(path -> path.toString().endsWith(".json"))
                    .map(this.importer::importPlayerFile)
                    .toList();
        }
        catch (IOException e) {
            System.err.println("mcstats: failed to list stats directory - " + e.getMessage());
            return;
        }

        List<McPlayerStat> statsForUpdate = parseTasks.stream()
                .map(CompletableFuture::join)
                .flatMap(List::stream)
                .toList();

        if (!statsForUpdate.isEmpty()) {
            this.playerStatRepository.saveAll(statsForUpdate);
        }
    }
}
