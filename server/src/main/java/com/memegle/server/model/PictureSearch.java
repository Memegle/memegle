package com.memegle.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.memegle.server.util.Constants;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Score;

import java.util.ArrayList;
import java.util.Date;

/**
 * We need this new entity bc we can't have 2 repo for Picture class at the same time.
 */
@Document(indexName = "memegle.pictures", type = "_doc")
public class PictureSearch {
    @Id
    private String id;   // id is stored as a string in elasticsearch

    // Whenever the schema of Picture changes, copy fields and getter methods from Picture class
    /* paste start */
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
    /* paste end */


    @Score
    private float searchScore;    // Read-only value, auto-populated by elastic repo

    private String urlSuffix;

    public PictureSearch() {}

    public String getId() {return id;}

    /* paste start */
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
    /* paste end */

    public float getSearchScore() {return this.searchScore;}

    @JsonProperty("fullUrl")
    public String getFullUrl() {
        return Constants.BASE_URL + Constants.IMAGE_MAPPING + this.urlSuffix;
    }
}
