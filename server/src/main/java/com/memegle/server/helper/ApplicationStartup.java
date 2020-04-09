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

import java.io.File;


@Component
public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {
    private final static Logger LOGGER = LoggerFactory.getLogger(ApplicationStartup.class);

    private final PictureRepository pictureRepo;
    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public ApplicationStartup(PictureRepository pictureRepo, SequenceGeneratorService sequenceGeneratorService) {
        this.pictureRepo = pictureRepo;
        this.sequenceGeneratorService = sequenceGeneratorService;
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
        File dataFolder = new File(PictureController.DATA_PATH);
        File[] picFiles = dataFolder.listFiles();

        if (picFiles == null)
            return;

        for (File picFile : picFiles) {
            Picture pic = new Picture();
            pic.setName(picFile.getName());
            pic.setUrl(ServerApplication.BASE_URL + PictureController.DATA_MAPPING + "/" + picFile.getName());
            pic.setId(sequenceGeneratorService.generateSequence(Picture.SEQUENCE_NAME));
            pictureRepo.save(pic);
        }
    }
}
