package com.memegle.server.controller;

import com.memegle.server.model.Picture;
import com.memegle.server.model.PictureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


@RestController
public class PictureController {
    // Constants
    public final static String DATA_PATH = "./src/main/resources/static/data";
    public final static String DATA_MAPPING = "/data";

    private final PictureRepository pictureRepo;

    @Autowired
    public PictureController(PictureRepository pictureRepo) {
        this.pictureRepo = pictureRepo;
    }

    @GetMapping("/all")
    @ResponseBody
    public List<String> all(){
        List<Picture> pictures = pictureRepo.findAll();
        ArrayList<String> urls = new ArrayList<>();

        for (Picture picture : pictures) {
            urls.add(picture.getUrl());
        }

        return urls;
    }
}
