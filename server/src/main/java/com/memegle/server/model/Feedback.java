package com.memegle.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedbacks")
public class Feedback {
    @Id
    private String id;
    private long count;

    // Empty constructor for mongo to work
    public Feedback() {

    }

    public Feedback(String feedback) {
        this.id = feedback;
        this.count = 1;
    }

    public String getId() {
        return id;
    }

    public long getCount() {
        return count;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public void increment() {
        this.count += 1;
    }
}
