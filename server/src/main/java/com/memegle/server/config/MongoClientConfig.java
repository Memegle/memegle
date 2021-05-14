package com.memegle.server.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.lang.NonNull;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoClientConfig extends AbstractMongoClientConfiguration {
    private final MongoProperties properties;

    public MongoClientConfig(MongoProperties properties) {
        this.properties = properties;
    }

    @Override
    @NonNull
    public MongoClient mongoClient() {
        String uri = System.getenv("MONGO_URI");

        if (uri == null) {
            uri = "mongodb://127.0.0.1:27017";
        }

        properties.setUri(uri);

        return MongoClients.create(uri);
    }

    @Bean
    @NonNull
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }

    @Override
    @NonNull
    protected String getDatabaseName() {
        return properties.getDatabase();
    }
}
