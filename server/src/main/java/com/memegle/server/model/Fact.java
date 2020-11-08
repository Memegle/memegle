package com.memegle.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "facts")
public class Fact {
    @Id
    private String id;
    private String text;

    public Fact() {}

    public Fact(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
