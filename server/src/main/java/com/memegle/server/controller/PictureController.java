package com.memegle.server.controller;

import com.memegle.server.dto.SearchQuery;
import com.memegle.server.model.PictureSearch;
import com.memegle.server.repository.PictureRepository;
import com.memegle.server.repository.PictureSearchRepository;
import com.memegle.server.model.Picture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * PLEASE keep the methods in this class in alphabetical order!!!!!
 */
@Controller
public class PictureController {
    // Constants
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

    @CrossOrigin
    @GetMapping("/all")
    @ResponseBody
    public List<Picture> all(){
        LOGGER.info("Request: GET /all");
        return pictureRepo.findAll();
    }

    @GetMapping("/count")
    @ResponseBody
    public long count() {
        return this.pictureRepo.count();
    }

    // Used for testing
    @GetMapping("/pictures/{id}")
    @ResponseBody
    public Picture id(@PathVariable long id) {
        return pictureRepo.findById(id);
    }

    @CrossOrigin
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
        return picture.getFullUrl();
    }

    @CrossOrigin
    @PostMapping(value = "/search",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<String> search(@RequestBody SearchQuery query) {
        if (query.keyword == null || query.keyword.length() == 0 || query.page < 0) {
            //TODO: change this to a HTTP error response
            return null;
        }

        Pageable pageable = PageRequest.of(query.page, ELE_PER_PAGE);

        LOGGER.info("Querying:\n" + query);

        return searchRepo.searchName(query.keyword, pageable)
                .stream()
                .map(PictureSearch::getFullUrl)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/welcome")
    public String welcome(HttpServletRequest request) {
        LOGGER.info("GET (/welcome) Request from ip: " + request.getRemoteAddr());
        return "index.html";
    }

}
