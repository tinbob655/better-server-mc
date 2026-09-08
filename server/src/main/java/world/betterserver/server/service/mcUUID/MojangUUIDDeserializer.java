package world.betterserver.server.service.mcUUID;

import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.deser.std.StdDeserializer;

import java.util.UUID;

public class MojangUUIDDeserializer extends StdDeserializer<UUID> {


    protected MojangUUIDDeserializer() {
        super(UUID.class);
    }

    @Override
    public UUID deserialize(JsonParser p, DeserializationContext ctxt) throws JacksonException {
        String value = p.getString();

        //mojang probably returned the UUID with no hyphens
        if (value.length() == 32) {
            value = value.substring(0, 8) + '-'
                    + value.substring(8, 12) + '-'
                    + value.substring(12, 16) + '-'
                    + value.substring(16, 20) + '-'
                    + value.substring(20);
        }
        return UUID.fromString(value);
    }
}
