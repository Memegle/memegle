package com.memegle.server.util;

import com.memegle.server.model.PictureSearch;
import com.memegle.server.model.Picture;

import java.util.Date;

// Handle the logic for instantiation of Picture objects.
public class PictureBuilder {
    private long id;
    private String name;
    private Date date;
    private String urlSuffix;

    private boolean idSet;
    private boolean nameSet;
    private boolean dateSet;
    private boolean urlSet;

    public PictureBuilder withId(long id) {
        this.id = id;
        idSet = true;

        return this;
    }

    public PictureBuilder withName(String name) {
        this.name = name;
        nameSet = true;

        return this;
    }

    public PictureBuilder withDate(Date date) {
        this.date = date;

        return this;
    }

    public PictureBuilder withUrlSuffix(String urlSuffix) {
        this.urlSuffix = urlSuffix;
        urlSet = true;

        return this;
    }

    public static Picture fromPictureSearch(PictureSearch search) {
        Picture pic = new Picture();
        pic.setUrlSuffix(search.getUrlSuffix());
        pic.setDateUpdated(search.getDateUpdated());
        pic.setName(search.getName());
        pic.setId(search.getId());

        return pic;
    }

    public Picture build() throws Exception {
        Picture picture = new Picture();

        if (!idSet || !nameSet) {
            throw new Exception("Missing required field " + (!idSet ? "id" : "name") + " for Picture object");
        }

        picture.setId(this.id);
        picture.setName(this.name);

        if (!dateSet) {
            this.date = new Date();
            dateSet = true;
        }

        picture.setDateUpdated(this.date);

        if (!urlSet) {
            String ext = "";

            int i = this.name.lastIndexOf('.');
            if (i > 0) {
                ext = this.name.substring(i);
            }

            this.urlSuffix = "/" + this.id + ext;
        }

        picture.setUrlSuffix(this.urlSuffix);

        return picture;
    }
}
