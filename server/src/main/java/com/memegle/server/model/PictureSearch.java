package com.memegle.server.model;
import org.bson.types.ObjectId;

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

    //field only in PictureSearch.java
      private int score;
    
    //field shared with Picture.java
    /* paste start */
    @Id
    private String id;
    private String sourceUrl;
    private String title;   
    private String source;
    private String mediaUrl;
    private String ext;
    private Date dateCreated;
    private int width;
    private int height;
    private ArrayList<String> texts;
    private ArrayList<Float> confidences;
    private ArrayList<ArrayList<ArrayList<Integer>>> boundingBoxes;
    /* paste end */


   
    public PictureSearch() {}
   //Update to fit DB schema

    //Getters
    public int getScore() {return this.score; }

   /* paste start */ 
    public String getId() {return this.id;}        
    public String getTitle() {return this.title; }
    public String getSource() {return this.source; }
    public String getSourceUrl(){return this.sourceUrl; }
    public String getMediaUrl() {return this.mediaUrl;}
    public String getExt() {return this.ext;}
    public Date getDateCreated() {return this.dateCreated;}
    public int getWidth() {return this.width;}
    public int getHeight() {return this.height;}
    public ArrayList<String> getTexts() {return texts;}
    public ArrayList<Float> getConfidences() {return confidences;}
    public ArrayList<ArrayList<ArrayList<Integer>>> getBoundingBoxes() {return boundingBoxes;}
    /* paste end */

}
