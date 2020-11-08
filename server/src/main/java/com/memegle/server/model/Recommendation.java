package com.memegle.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "recommendations")
public class Recommendation {
    @Id
    private String keyword;

    public Recommendation() {}

    public Recommendation(String keyword) {
        this.keyword = keyword;
    }

    public String getKeyword() {
        return keyword;
    }
}
