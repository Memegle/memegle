package com.memegle.server.model;

import com.memegle.server.util.PictureBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Score;

import java.util.Date;

/**
 * We need this new entity bc we can't have 2 repo for Picture class at the same time.
 */
@Document(indexName = "memegle.pictures", type = "_doc")
public class PictureSearch {
    @Id
    private String id;   // id is stored as a string in elasticsearch
    private String name;
    private Date dateUpdated;
    private String urlSuffix;
    private int width;
    private int height;

    @Score
    private float score;    // Read-only value, auto-populated by elastic repo

    public PictureSearch() {}

    public Picture toPicture() {
        try {
            // muse use getter method (they are overridden by spring and will return the correct value from repo)
            return new PictureBuilder()
                    .withId(getId())
                    .withName(getName())
                    .withUrlSuffix(getUrlSuffix())
                    .withDate(getDateUpdated())
                    .withWidth(getWidth())
                    .withHeight(getHeight())
                    .build();
        }
        catch (Exception e) {
            return null;
        }
    }

    public String getId() {return id;}
    public String getName() {return name;}
    public int getWidth() {return width;}
    public int getHeight() {return height;}
    public String getUrlSuffix() {return urlSuffix;}
    public Date getDateUpdated() {return dateUpdated;}

    public float getScore() {return this.score;}
}
