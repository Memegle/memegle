package com.memegle.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.memegle.server.helper.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pictures")
public class Picture {

    @Transient
    public static final String SEQUENCE_NAME = "picture_sequence";

    @Id
    private long id;

    private String name;

    @JsonIgnore
    private String path;

    public Picture() {
    }

    public long getId() {return this.id;}
    public String getName() {return this.name;}
    public String getPath() {return this.path;}

    public void setId(long id) {this.id = id;}
    public void setName(String name) {this.name = name;}
    public void setPath(String path) {this.path = path;}
}
