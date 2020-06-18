package com.memegle.server.Picture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Random;

@CrossOrigin
@Controller
public class PictureController {
    // Constants
    public final static String DATA_MAPPING = "/data";

    private final PictureRepository pictureRepo;

    // Logging
    private static final Logger LOGGER = LoggerFactory.getLogger(PictureController.class);
    private static long count = 0;

    @Autowired
    public PictureController(PictureRepository pictureRepo) {
        this.pictureRepo = pictureRepo;
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/welcome/";
    }

    @GetMapping(value = "/welcome")
    public String welcome(HttpServletRequest request) {
        LOGGER.info("GET (/welcome) Request from ip: " + request.getRemoteAddr());
        return "index.html";
    }

    @GetMapping("/all")
    @ResponseBody
    public List<Picture> all(){
        LOGGER.info("Request: GET /all");
        return pictureRepo.findAll();
    }

    @GetMapping("/random")
    @ResponseBody
    public String random() {
        LOGGER.info("random() called " + ++count + " times.");
        Random random = new Random();
        long count = this.pictureRepo.count();
        if (count <= 0) {
            return "";
        }
        long id = Math.abs(random.nextLong()) % count + 1;
        Picture picture = this.pictureRepo.findById(id);
        return picture.getUrl();
    }

    @GetMapping("/count")
    @ResponseBody
    public long count() {
        return this.pictureRepo.count();
    }
}
