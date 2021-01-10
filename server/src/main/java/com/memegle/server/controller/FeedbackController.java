package com.memegle.server.controller;

import com.memegle.server.service.FeedbackService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@CrossOrigin
@Controller
@RequestMapping("/feedback")
public class FeedbackController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FeedbackController.class);

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String processFeedback(@RequestBody List<String> feedbackStrs) {
        if (feedbackStrs.size() == 0 || feedbackStrs.contains("")) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "反馈信息不能为空！");
        }
        for (String feedbackStr : feedbackStrs) {
            LOGGER.info("Recording feedback " + feedbackStr);
            feedbackService.recordFeedback(feedbackStr);
        }

        return "acknowledged";
    }
}
