package com.memegle.server.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "searches")
public class Search {
    private String keyword;
    private Date date;
    private int resultFound;

    public Search() {}

    public Search(String keyword, Date date, int found) {
        this.keyword = keyword;
        this.date = date;
        this.resultFound = found;
    }

    public String getKeyword() {
        return keyword;
    }

    public Date getDate() {
        return date;
    }

    public int getResultFound() {
        return resultFound;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setResultFound(int resultFound) {
        this.resultFound = resultFound;
    }
}
