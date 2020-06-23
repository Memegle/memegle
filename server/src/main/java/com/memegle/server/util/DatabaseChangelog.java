package com.memegle.server.util;

import com.github.cloudyrock.mongock.ChangeLog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// DON'T use @Autowired annotation in this class as documented on mongock documentation
// Parameters will be correctly connected to beans declared in the application context
@ChangeLog
public class DatabaseChangelog {
    private final static Logger LOGGER = LoggerFactory.getLogger(DatabaseChangelog.class);

//    @ChangeSet(author = "memegle", id = "applicationStartup", order = "01", runAlways = true)
//    public void initializePictureDatabase(MongoTemplate mongoTemplate, PictureRepository pictureRepo,
//                                          ServletContext servletContext,
//                                          SequenceGeneratorService sequenceGenerator) throws Exception {
//        LOGGER.info("Reinitializing Data...");
//
//        ServerApplication.STATIC_RESOURCES_PATH = servletContext.getRealPath("WEB-INF/classes/static/");
//
//        pictureRepo.deleteAll();
//
//        File dataFolder = new File(ServerApplication.STATIC_RESOURCES_PATH + "data");
//        // When not using docker-compose, a relative path should be used
//        if (!dataFolder.exists()) {
//            dataFolder = new File("./src/main/resources/static/data");
//            ServerApplication.STATIC_RESOURCES_PATH = "./src/main/resources/static/";
//        }
//
//        // TODO: Create another folder for new pictures so that we don't have to repopulate the entire db everytime.
//        // TODO: Add some library to compare picture similarity to avoid duplicates in the db.
//
//        LOGGER.info("DATA_PATH: " + dataFolder);
//
//        File[] picFiles = dataFolder.listFiles();
//
//        if (picFiles == null)   return;
//
//        // instantiating picture objects and save to db
//        for (int i = 0; i < picFiles.length; i++) {
//            File picFile = picFiles[i];
//            Picture pic = new PictureBuilder()
//                    .withId(sequenceGenerator.generateSequence(Picture.SEQUENCE_NAME))
//                    .withName(picFile.getName())
//                    .build();
//            pictureRepo.save(pic);
//        }
//    }
}
