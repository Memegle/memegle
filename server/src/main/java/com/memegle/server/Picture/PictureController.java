package com.memegle.server.Picture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Random;


@Controller
public class PictureController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PictureController.class);
    // Constants
    public final static String DATA_MAPPING = "/data";

    private final PictureRepository pictureRepo;

    @Autowired
    public PictureController(PictureRepository pictureRepo) {
        this.pictureRepo = pictureRepo;
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/welcome";
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "index.html";
    }

    @GetMapping("/all")
    @ResponseBody
    public List<Picture> all(){
        LOGGER.info("Request: GET /all");

        return pictureRepo.findAll();
    }

    @CrossOrigin(origins = "http://localhost")
    @GetMapping("/random")
    @ResponseBody
    public String random() {
        Random random = new Random();
        long id = Math.abs(random.nextLong()) % this.pictureRepo.count();
        Picture picture = this.pictureRepo.findById(id);
        return picture.getUrl();
    }

    @GetMapping("/count")
    @ResponseBody
    public long count() {
        return this.pictureRepo.count();
    }
}
