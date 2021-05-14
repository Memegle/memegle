package com.memegle.server.controller;

import com.memegle.server.dto.SearchQuery;
import com.memegle.server.model.PictureSearch;
import com.memegle.server.model.Search;
import com.memegle.server.repository.PictureRepository;
import com.memegle.server.repository.PictureSearchRepository;
import com.memegle.server.model.Picture;
import com.memegle.server.repository.SearchRepository;
import com.memegle.server.service.SequenceGeneratorService;
import com.mongodb.Mongo;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * PLEASE keep the methods in this class in alphabetical order!!!!!
 */
@CrossOrigin
@Controller
public class PictureController {
    // TODO: put this param in the db
    // Constants
    public final static int PIC_PER_PAGE = 200;
    // Logging
    private static final Logger LOGGER = LoggerFactory.getLogger(PictureController.class);

    private final PictureRepository pictureRepo;
    private final PictureSearchRepository pictureSearchRepo;
    private final SearchRepository searchRepo;
    private final MongoTemplate mongoTemplate;

    public PictureController(PictureRepository pictureRepo, PictureSearchRepository pictureSearchRepo,
                             SearchRepository searchRepo, MongoTemplate mongoTemplate) {
        this.pictureRepo = pictureRepo;
        this.pictureSearchRepo = pictureSearchRepo;
        this.searchRepo = searchRepo;
        this.mongoTemplate = mongoTemplate;
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

    @GetMapping("/random")
    @ResponseBody
    public Picture random() {
        SampleOperation sample = Aggregation.sample(1);
        Aggregation aggregation = Aggregation.newAggregation(sample);
        AggregationResults<Picture> output = mongoTemplate
                .aggregate(aggregation, "pictures", Picture.class);

        return output.getUniqueMappedResult();
    }

    @PostMapping(value = "/search",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<PictureSearch> search(@RequestBody SearchQuery query) {
        if (query.keyword == null || query.keyword.length() == 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot perform search on empty string");
        }

        Pageable pageable = PageRequest.of(0, PIC_PER_PAGE);

        LOGGER.info("Querying:\n" + query);

        List<PictureSearch> result =  pictureSearchRepo.searchTitle(query.keyword, pageable);

        // Log search query to db
        searchRepo.save(new Search(query.keyword, new Date(), result.size()));

        return result;
    }
}
