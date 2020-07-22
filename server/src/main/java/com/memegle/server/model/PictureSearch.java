package com.memegle.server.model;

import com.memegle.server.util.Constants;
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
    // These fields need to be public for searchRepo to populate them
    @Id
    public long id;
    public String name;
    public Date dateUpdated;
    public String urlSuffix;
    public int width;
    public int height;

    @Score
    private float score;    // Read-only value, auto-populated by elastic repo

    public PictureSearch() {}

    public Picture toPicture() {
        try {
            return new PictureBuilder()
                    .withId(id)
                    .withName(name)
                    .withUrlSuffix(urlSuffix)
                    .withDate(dateUpdated)
                    .withWidth(width)
                    .withHeight(height)
                    .build();
        }
        catch (Exception e) {
            return null;
        }
    }

    public float getScore() {return this.score;}
}
