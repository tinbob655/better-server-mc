package world.betterserver.server.service.profilePicture;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

public interface ProfilePictureService {

    String store(String username, MultipartFile file) throws IOException, IllegalArgumentException;

    void delete(String storedFilename) throws IOException;

    Resource load(String storedFilename) throws MalformedURLException;
}
