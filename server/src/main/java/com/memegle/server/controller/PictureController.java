package com.memegle.server.controller;

import com.memegle.server.dto.SearchQuery;
import com.memegle.server.model.PictureSearch;
import com.memegle.server.repository.PictureRepository;
import com.memegle.server.repository.PictureSearchRepository;
import com.memegle.server.model.Picture;
import com.memegle.server.service.SequenceGeneratorService;
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
@CrossOrigin
@Controller
public class PictureController {
    // TODO: put this param in the db
    // Constants
    public final static int PIC_PER_PAGE = 200;

    private final PictureRepository pictureRepo;
    private final PictureSearchRepository searchRepo;
    private final SequenceGeneratorService sequenceGeneratorService;

    // Logging
    private static final Logger LOGGER = LoggerFactory.getLogger(PictureController.class);

    public PictureController(PictureRepository pictureRepo, PictureSearchRepository searchRepository,
                             SequenceGeneratorService sequenceGeneratorService) {
        this.pictureRepo = pictureRepo;
        this.searchRepo = searchRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/welcome/";
    }

    @GetMapping("/all")
    @ResponseBody
    public List<Picture> all(){
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

    @GetMapping("/random")
    @ResponseBody
    public String random() {
        Random random = new Random();
        long count = this.pictureRepo.count();
        if (count <= 0) {
            return "";
        }
        long id = Math.abs(random.nextLong()) % count + 1;
        Picture picture = this.pictureRepo.findById(id);
        return picture.getFullUrl();
    }

    @PostMapping(value = "/search",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Picture> search(@RequestBody SearchQuery query) {
        if (query.keyword == null || query.keyword.length() == 0) {
            //TODO: change this to a HTTP error response
            return null;
        }

        Pageable pageable = PageRequest.of(0, PIC_PER_PAGE);

        LOGGER.info("Querying:\n" + query);

        return searchRepo.searchName(query.keyword, pageable)
                .stream()
                .map(PictureSearch::toPicture)
                .collect(Collectors.toList());
    }

    @GetMapping("/secrets/{name}")
    public String secrets(HttpServletRequest request, @PathVariable String name) {
        return name + "/index.html";
    }

    // Getting the picture sequence, for manual data migration.
    @GetMapping("/sequence")
    @ResponseBody
    public long sequence() {
        return sequenceGeneratorService.getCurrentSequence(Picture.SEQUENCE_NAME);
    }

    @GetMapping(value = "/welcome")
    public String welcome(HttpServletRequest request) {
        return "index.html";
    }

}
