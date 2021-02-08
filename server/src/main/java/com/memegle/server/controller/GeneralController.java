package com.memegle.server.controller;

import com.memegle.server.model.Fact;
import com.memegle.server.model.Recommendation;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin
@Controller
public class GeneralController {
    private final MongoTemplate mongoTemplate;

    public GeneralController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/facts")
    @ResponseBody
    public String getRandomFact() {
        // randomly fetch one fact
        SampleOperation sample = Aggregation.sample(1);
        Aggregation aggregation = Aggregation.newAggregation(sample);

        Fact fact = mongoTemplate.aggregate(aggregation, "facts", Fact.class)
                .getMappedResults().get(0);

        return fact.getText();
    }

    @GetMapping("/recommendations")
    @ResponseBody
    public String getRandomRecommendation() {
        SampleOperation sample = Aggregation.sample(1);
        Aggregation aggregation = Aggregation.newAggregation(sample);


        Recommendation recommendation = mongoTemplate
                .aggregate(aggregation, "recommendations", Recommendation.class)
                .getMappedResults().get(0);

        return recommendation.getKeyword();
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/welcome/";
    }

    @GetMapping("/secrets/{name}")
    public String secrets(HttpServletRequest request, @PathVariable String name) {
        return "secrets/" + name + "/index";
    }

    @GetMapping(value = "/welcome")
    public String welcome(HttpServletRequest request) {
        return "/welcome/index";
    }
}