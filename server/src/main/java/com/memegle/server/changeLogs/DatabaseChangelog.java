package com.memegle.server.changeLogs;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.memegle.server.model.Picture;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

// Mongock documentations: https://www.mongock.io/changelogs

// DON'T use @Autowired annotation in this class as documented on mongock documentation
// Parameters will be correctly connected to beans declared in the application context
@ChangeLog
public class DatabaseChangelog {
    private final static Logger LOGGER = LoggerFactory.getLogger(DatabaseChangelog.class);

    @ChangeSet(author = "Paul", id = "renameTextAndConfidenceAndAddTag", order = "001")
    public void renameTextAndConfidenceAndAddTag(MongoTemplate mongoTemplate) {
        LOGGER.info("Executing change log renameTextAndConfidenceAndAddTag...");
        Query emptyQuery = new Query();
        Update update = new Update();
        mongoTemplate.updateMulti(emptyQuery, update.rename("text", "texts"), Picture.class);
        mongoTemplate.updateMulti(emptyQuery, update.rename("confidence", "confidences"), Picture.class);
    }
}
