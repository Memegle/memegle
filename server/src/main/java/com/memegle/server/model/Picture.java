package com.memegle.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.Date;


@Document(collection = "pictures")
public class Picture {
    //field only in Picture.java
    @Id
    private ObjectId id;
    @Field("source_url")
    private String sourceUrl;
    @Field("media_url")
    private String mediaUrl;
    @Field("bounding_boxes")
    private ArrayList<ArrayList<ArrayList<Integer>>> boundingBoxes;
    @Field("date_created")
    private Date dateCreated;

    //field shared with PictureSearch.java
    private String title;   
    private String source;
    private String ext;
    private int width;
    private int height;
    private ArrayList<String> texts;
    private ArrayList<Float> confidences;

    public Picture() {}

    public static Picture fromPictureSearch(PictureSearch search) {
        Picture picture = new Picture();
        // set all values
        picture.setId(search.getId());
        picture.setTitle(search.getTitle());                
        picture.setSource(search.getSource());
        picture.setSourceUrl(search.getSourceUrl());
        picture.setMediaUrl(search.getMediaUrl());
        picture.setExt(search.getExt());
        picture.setDateCreated(search.getDateCreated());
        picture.setWidth(search.getWidth());
        picture.setHeight(search.getHeight());
        picture.setTexts(search.getTexts());
        picture.setConfidences(search.getConfidences());
        picture.setBoundingBoxes(search.getBoundingBoxes());

        return null;
    }
 
    //Getters
    public String getId() {return id.toString();}
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

    //Setters 
    public void setId(String id) {this.id = new ObjectId(id);}
    public void setTitle(String title) {this.title = title;}     
    public void setSource(String src) {this.source = src;}      
    public void setSourceUrl(String sourceUrl) {this.sourceUrl = sourceUrl;}
    public void setMediaUrl(String mediaUrl) {this.mediaUrl = mediaUrl;}
    public void setExt(String ext) {this.ext = ext;}
    public void setDateCreated(Date date) {this.dateCreated = date;}
    public void setWidth(int w) {this.width = w;}
    public void setHeight(int h) {this.height = h;}
    public void setTexts(ArrayList<String> text) {this.texts = text;}
    public void setConfidences(ArrayList<Float> confidence) {this.confidences = confidence;}
    public void setBoundingBoxes(ArrayList<ArrayList<ArrayList<Integer>>> boundingBoxes) {this.boundingBoxes = boundingBoxes;}
}
