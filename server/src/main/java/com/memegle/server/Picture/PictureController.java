package com.memegle.server.Picture;

import com.memegle.server.ServerApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@CrossOrigin
@Controller
public class PictureController {
    // Constants
    public final static String DATA_MAPPING = "/data";
    private final static int ELE_PER_PAGE = 10;

    private final PictureRepository pictureRepo;
    private final PictureSearchRepository searchRepo;

    // Logging
    private static final Logger LOGGER = LoggerFactory.getLogger(PictureController.class);
    private static long count = 0;

    public PictureController(PictureRepository pictureRepo, PictureSearchRepository searchRepository) {
        this.pictureRepo = pictureRepo;
        this.searchRepo = searchRepository;
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

    @CrossOrigin
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
        return picture.getUrlSuffix();
    }

    @GetMapping("/count")
    @ResponseBody
    public long count() {
        return this.pictureRepo.count();
    }

    @CrossOrigin
    @GetMapping("/search/{keyword}/{page}")
    @ResponseBody
    public List<String> pathSearch(@PathVariable String keyword, @PathVariable int page) {
        return searchResult(keyword, page);
    }

    @CrossOrigin
    @GetMapping("/search")
    @ResponseBody
    public List<String> urlSearch(@RequestParam(value = "keyword", required = false) String keyword, @RequestParam(value = "page", defaultValue = "0") int page) {
        return searchResult(keyword, page);
    }

    // Used for testing
    @GetMapping("/id/{id}")
    @ResponseBody
    public Picture id(@PathVariable long id) {
        return pictureRepo.findById(id);
    }

    private List<String> searchResult(String keyword, int page) {
        if (keyword == null || keyword.length() == 0 || page < 0) {
            return null;
        }

        Pageable pageable = PageRequest.of(page, ELE_PER_PAGE);

        return searchRepo.searchName(keyword, pageable)
                .stream()
                .map(pic -> ServerApplication.BASE_URL + DATA_MAPPING + pic.getUrlSuffix())
                .collect(Collectors.toList());
    }
}
