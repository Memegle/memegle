package com.memegle.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.memegle.server.util.Constants;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;


@Document(collection = "pictures")
public class Picture {
    @Transient
    public static final String SEQUENCE_NAME = "picture_sequence";

    @Id
    private long id;

    private String name;
    private String filetype;
    private Date dateUpdated;
    private int width;
    private int height;
    private ArrayList<String> texts;
    private ArrayList<Float> confidences;
    private ArrayList<ArrayList<ArrayList<Integer>>> boundingBoxes;
    private ArrayList<String> tags;
    private long like;
    private long dislike;

    @Transient
    private float searchScore;

    @JsonIgnore
    private String urlSuffix;

    public Picture() {}

    public static Picture fromPictureSearch(PictureSearch search) {
        Picture picture = new Picture();
        // set all values
        picture.setId(Long.parseLong(search.getId()));
        picture.setName(search.getName());
        picture.setFiletype(search.getFiletype());
        return null;
    }

    public long getId() {return this.id;}

    public String getName() {return this.name;}
    public String getFiletype() {return this.filetype;}
    public String getUrlSuffix() {return this.urlSuffix;}
    public Date getDateUpdated() {return this.dateUpdated;}
    public int getWidth() {return this.width;}
    public int getHeight() {return this.height;}
    public ArrayList<String> getTexts() {return texts;}
    public ArrayList<Float> getConfidences() {return confidences;}
    public ArrayList<ArrayList<ArrayList<Integer>>> getBoundingBoxes() {return boundingBoxes;}
    public ArrayList<String> getTags() {return tags;}
    public long getLike() {return like;}
    public long getDislike() {return dislike;}

    public float getSearchScore() {return searchScore;}

    @JsonProperty("fullUrl")
    public String getFullUrl() {
        return Constants.BASE_URL + Constants.IMAGE_MAPPING + this.urlSuffix;
    }

    public void setId(long id) {this.id = id;}
    public void setName(String name) {this.name = name;}
    public void setFiletype(String filetype) {this.filetype = filetype;}
    public void setUrlSuffix(String urlSuffix) {this.urlSuffix = urlSuffix;}
    public void setDateUpdated(Date date) {this.dateUpdated = date;}
    public void setWidth(int w) {this.width = w;}
    public void setHeight(int h) {this.height = h;}
    public void setTexts(ArrayList<String> text) {this.texts = text;}
    public void setConfidences(ArrayList<Float> confidence) {this.confidences = confidence;}
    public void setBoundingBoxes(ArrayList<ArrayList<ArrayList<Integer>>> boundingBoxes) {this.boundingBoxes = boundingBoxes;}
    public void setTags(ArrayList<String> tags) {this.tags = tags;}
    public void setLike(long like) {this.like = like;}
    public void setDislike(long dislike) {this.dislike = dislike;}
}
