package com.memegle.server.controller;

import com.memegle.server.helper.SequenceGeneratorService;
import com.memegle.server.model.Picture;
import com.memegle.server.model.PictureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Collection;

@RestController
public class PictureController {
    // Constants
    public final static String DATA_PATH = "../data";

    private final PictureRepository pictureRepo;
    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public PictureController(PictureRepository pictureRepo, SequenceGeneratorService sequenceGeneratorService) {
        this.pictureRepo = pictureRepo;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    @GetMapping("/all")
    @ResponseBody
    public Collection<Picture> all(){
        return pictureRepo.findAll();
    }

    @GetMapping("/scan")
    public String scan() {
        scanDataPath();

        return "Success";
    }

    private void scanDataPath() {
        File dataFolder = new File(DATA_PATH);
        File[] picFiles = dataFolder.listFiles();

        if (picFiles == null)
            return;

        for (File picFile : picFiles) {
            Picture pic = new Picture();
            pic.setName(picFile.getName());
            pic.setPath(picFile.getPath());
            pic.setId(sequenceGeneratorService.generateSequence(Picture.SEQUENCE_NAME));
            pictureRepo.save(pic);
        }
    }
}
