package com.memegle.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "database_sequences")
public class DatabaseSequence {

    @Id
    private String id;

    private long seq;

    public DatabaseSequence() {}

    public String getId() {return this.id;}
    public long getSeq() {return this.seq;}

    public void setId(String id) {this.id = id;}
    public void setSeq(long seq) {this.seq = seq;}
}
