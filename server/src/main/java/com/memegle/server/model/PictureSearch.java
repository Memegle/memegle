package com.memegle.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.Score;

import java.util.ArrayList;
import java.util.Date;


/**
 * We need this new entity bc we can't have 2 repo for Picture class at the same time.
 */
@Document(indexName = "memegle.pictures", type = "_doc")
public class PictureSearch {

    //field only in PictureSearch.java
    @Id
    private String id;
    @Score
    private float score;
    @JsonProperty("source_url")
    private String sourceUrl;
    @JsonProperty("media_url")
    private String mediaUrl;
    @JsonProperty("bounding_boxes")
    private ArrayList<ArrayList<ArrayList<Integer>>> boundingBoxes;
    @JsonProperty("date_created")
    private Date dateCreated;

    //field shared with Picture.java
    /* paste start */
    private String title;
    private String source;
    private String ext;
    private int width;
    private int height;
    private ArrayList<String> texts;
    private ArrayList<Float> confidences;
    /* paste end */

    public PictureSearch() {}

    // getters
    public float getScore() {return this.score;}

    /* paste start */
    public String getId() {return this.id;}
    public String getTitle() {return this.title;}
    public String getSource() {return this.source;}
    public String getSourceUrl(){return this.sourceUrl;}
    public String getMediaUrl() {return this.mediaUrl;}
    public String getExt() {return this.ext;}
    public Date getDateCreated() {return this.dateCreated;}
    public int getWidth() {return this.width;}
    public int getHeight() {return this.height;}
    public ArrayList<String> getTexts() {return this.texts;}
    public ArrayList<Float> getConfidences() {return this.confidences;}
    public ArrayList<ArrayList<ArrayList<Integer>>> getBoundingBoxes() {return this.boundingBoxes;}
    /* paste end */
}
