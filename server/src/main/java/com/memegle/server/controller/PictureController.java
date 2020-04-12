package com.memegle.server.controller;

import com.memegle.server.model.Picture;
import com.memegle.server.model.PictureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


@RestController
public class PictureController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PictureController.class);
    // Constants
    public final static String DATA_MAPPING = "/data";

    private final PictureRepository pictureRepo;

    @Autowired
    public PictureController(PictureRepository pictureRepo) {
        this.pictureRepo = pictureRepo;
    }

    @GetMapping("/all")
    @ResponseBody
    public List<String> all(){
        LOGGER.info("Request: GET /all");

        List<Picture> pictures = pictureRepo.findAll();
        ArrayList<String> urls = new ArrayList<>();

        for (Picture picture : pictures) {
            urls.add(picture.getUrl());
        }

        return urls;
    }
}
