package com.memegle.server.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.memegle.server.util.Constants;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import java.util.ArrayList;
import java.util.Date;


@Document(collection = "pictures")
public class Picture {
    @Transient
    public static final String SEQUENCE_NAME = "picture_sequence";

    @Id
    private ObjectId id;
    private String sourceUrl;
    private String title;   
    private String source;
    private String mediaUrl;
    private String ext;

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


    public Picture() {}

    public static Picture fromPictureSearch(PictureSearch search) {
        Picture picture = new Picture();
        // set all values
        picture.setId(search.getId());                      //------------------------
        picture.setTitle(search.getTitle());                //------------------------
        picture.setFiletype(search.getFiletype());
        return null;
    }
 
    //adjust getters for variables id an title
    public ObjectId getId() {return this.id;}
    public String getTitle() {return this.title;}
    public String getSourceUrl(){return this.sourceUrl}
    public String getMediaUrl() {return this.mediaUrl;}
    public String getExt() {return this.ext;}

    public String getFiletype() {return this.filetype;}
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


    public void setId(ObjectId id) {this.id = id;}                 
    public void setTitle(String title) {this.title = title;}        
    public String setSourceUrl(String sourceUrl) {this.sourceUrl = sourceUrl;}
    public void setMediaUrl(String mediaUrl) {this.mediaUrl = mediaUrl;}
    public void setExt(String ext) {this.ext = ext;}


    public void setFiletype(String filetype) {this.filetype = filetype;}
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
