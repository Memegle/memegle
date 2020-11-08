package com.memegle.server.changeLogs;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.memegle.server.model.Picture;
import com.memegle.server.repository.PictureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

// Mongock documentations: https://www.mongock.io/changelogs

// DON'T use @Autowired annotation in this class as documented on mongock documentation
// Parameters will be correctly connected to beans declared in the application context
@ChangeLog
public class PictureChangelog {
    private final static Logger LOGGER = LoggerFactory.getLogger(PictureChangelog.class);

    @ChangeSet(author = "Paul", id = "enforcePictureSchema", order = "000", runAlways = true)
    public void enforcePictureSchema(PictureRepository pictureRepo) {
        LOGGER.info("Enforce DB schema start...");
        Instant start = Instant.now();
        List<Picture> all = pictureRepo.findAll();
        pictureRepo.saveAll(all);
        Instant end = Instant.now();
        LOGGER.info("Enforced DB schema finished, took " + Duration.between(start, end).getSeconds() + " seconds");
    }

    @ChangeSet(author = "Paul", id = "renameTextAndConfidenceAndAddTag", order = "001")
    public void renameTextAndConfidenceAndAddTag(MongoTemplate mongoTemplate) {
        LOGGER.info("Executing change log renameTextAndConfidenceAndAddTag...");
        Query emptyQuery = new Query();
        Update update = new Update();
        mongoTemplate.updateMulti(emptyQuery, update.rename("text", "texts"), Picture.class);
        mongoTemplate.updateMulti(emptyQuery, update.rename("confidence", "confidences"), Picture.class);
    }
}
