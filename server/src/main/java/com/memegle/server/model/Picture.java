package com.memegle.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.memegle.server.util.Constants;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "pictures")
public class Picture {

    @Transient
    public static final String SEQUENCE_NAME = "picture_sequence";

    @Id
    private long id;
    private String name;
    private Date dateUpdated;
    private int width;
    private int height;
    @JsonIgnore
    private String urlSuffix;

    public Picture() {}

    public long getId() {return this.id;}
    public String getName() {return this.name;}
    public String getUrlSuffix() {return this.urlSuffix;}
    public Date getDateUpdated() {return this.dateUpdated;}
    public int getWidth() {return this.width;}
    public int getHeight() {return this.height;}
    @JsonProperty("fullUrl")
    public String getFullUrl() {
        return Constants.BASE_URL + Constants.IMAGE_MAPPING + this.urlSuffix;
    }

    public void setId(long id) {this.id = id;}
    public void setName(String name) {this.name = name;}
    public void setUrlSuffix(String urlSuffix) {this.urlSuffix = urlSuffix;}
    public void setDateUpdated(Date date) {this.dateUpdated = date;}
    public void setWidth(int w) {this.width = w;}
    public void setHeight(int h) {this.height = h;}
}
