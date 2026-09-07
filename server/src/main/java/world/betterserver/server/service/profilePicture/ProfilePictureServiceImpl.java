package world.betterserver.server.service.profilePicture;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfilePictureServiceImpl implements ProfilePictureService {

    private final Path uploadRoot = Paths.get("uploads/profilePictures").toAbsolutePath();
    private static final Set<String> ALLOWED_TYPES = Set.of("image/png", "image/jpeg", "image/webp");


    @Override
    public String store(String username, MultipartFile file) throws IOException, IllegalArgumentException {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Only PNG, JPEG or WEBP images are allowed");
        }

        Files.createDirectories(this.uploadRoot);
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String storedName = username + '_' + UUID.randomUUID() + '.' + extension;

        Path target = this.uploadRoot.resolve(storedName).normalize();
        if (!target.startsWith(uploadRoot)) throw new IOException("Bad path");

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }
        return storedName;
    }

    @Override
    public void delete(String storedFilename) throws IOException {
        if (storedFilename != null) Files.deleteIfExists(this.uploadRoot.resolve(storedFilename));
    }

    @Override
    public Resource load(String storedFilename) throws MalformedURLException {
        return new UrlResource(this.uploadRoot.resolve(storedFilename).toUri());
    }
}
