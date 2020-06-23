package com.memegle.server.dto;

public class SearchQuery {
    public String keyword;
    public int page;

    @Override
    public String toString() {
        return "{" + "\n" +
                "keyword=" + keyword + "\n" +
                "page=" + page + "\n" +
                "}";
    }
}
