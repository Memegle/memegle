package com.memegle.server.service;

import com.memegle.server.model.Feedback;
import com.memegle.server.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public void recordFeedback(String feedbackStr) {
        Feedback feedback = feedbackRepository.findById(feedbackStr).orElse(null);
        if (feedback != null) {
            feedback.increment();
            feedbackRepository.save(feedback);
        } else {
            feedbackRepository.save(new Feedback(feedbackStr));
        }

    }
}
