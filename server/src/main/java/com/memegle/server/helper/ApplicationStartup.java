package com.memegle.server.helper;

import com.memegle.server.ServerApplication;
import com.memegle.server.controller.PictureController;
import com.memegle.server.model.Picture;
import com.memegle.server.model.PictureRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContext;
import java.io.File;


@Component
public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {
    private final static Logger LOGGER = LoggerFactory.getLogger(ApplicationStartup.class);

    private final PictureRepository pictureRepo;
    private final SequenceGeneratorService sequenceGeneratorService;

    private ServletContext servletContext;
    private static String STATIC_RESOURCES_PATH;

    @Autowired
    public ApplicationStartup(PictureRepository pictureRepo, SequenceGeneratorService sequenceGeneratorService, ServletContext servletContext) {
        this.pictureRepo = pictureRepo;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.servletContext = servletContext;
        STATIC_RESOURCES_PATH = servletContext.getRealPath("WEB-INF/classes/static/");
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        LOGGER.info("Application Started");

        LOGGER.info("Reinitializing Data...");
        pictureRepo.deleteAll();
        sequenceGeneratorService.resetSequence(Picture.SEQUENCE_NAME);

        scanDataPath();
    }

    private void scanDataPath() {
        File dataFolder = new File(STATIC_RESOURCES_PATH + "data");
        if (!dataFolder.exists()) {
            dataFolder = new File("./src/main/resources/static/data");
            STATIC_RESOURCES_PATH = "./src/main/resources/static/";
        }
        LOGGER.info("DATA_PATH: " + dataFolder.getAbsolutePath());
        File[] picFiles = dataFolder.listFiles();

        if (picFiles == null)
            return;

        for (File picFile : picFiles) {
            Picture pic = new Picture();
            pic.setName(picFile.getName());
            pic.setUrl(ServerApplication.BASE_URL + PictureController.DATA_MAPPING + "/" + pic.getName());
            pic.setId(sequenceGeneratorService.generateSequence(Picture.SEQUENCE_NAME));
            pictureRepo.save(pic);
        }
    }

}
