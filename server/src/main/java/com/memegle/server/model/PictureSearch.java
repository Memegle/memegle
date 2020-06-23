package com.memegle.server.model;

import com.memegle.server.util.Constants;
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
    private long id;
    private String name;
    private Date dateUpdated;

    private String urlSuffix;

    @Score
    private float score;    // Read-only value, auto-populated by elastic repo

    public PictureSearch() {
    }

    public long getId() {return this.id;}
    public String getName() {return this.name;}
    public String getUrlSuffix() {return this.urlSuffix;}
    public Date getDateUpdated() {return this.dateUpdated;}
    public float getScore() {return this.score;}
    public String getFullUrl() {
        return Constants.BASE_URL + Constants.DATA_MAPPING + this.urlSuffix;
    }

    public void setId(long id) {this.id = id;}
    public void setName(String name) {this.name = name;}
    public void setUrlSuffix(String urlSuffix) {this.urlSuffix = urlSuffix;}
    public void setDateUpdated(Date date) {this.dateUpdated = date;}
}
