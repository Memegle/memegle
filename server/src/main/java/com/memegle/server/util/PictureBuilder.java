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
    private int width;
    private int height;

    private boolean idSet;
    private boolean nameSet;
    private boolean dateSet;
    private boolean urlSet;
    private boolean widthSet;
    private boolean heightSet;

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
        dateSet = true;

        return this;
    }

    public PictureBuilder withUrlSuffix(String urlSuffix) {
        this.urlSuffix = urlSuffix;
        urlSet = true;

        return this;
    }

    public PictureBuilder withHeight(int h) {
        this.height = h;
        this.heightSet = true;

        return this;
    }

    public PictureBuilder withWidth(int w) {
        this.width = w;
        this.widthSet = true;

        return this;
    }

    public void reset() {
        this.id = -1;
        this.name = null;
        this.date = null;
        this.urlSuffix = null;
        this.idSet = false;
        this.nameSet = false;
        this.dateSet = false;
        this.urlSet = false;
        this.heightSet = false;
        this.widthSet = false;
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

        if (!this.heightSet) {
            this.height = -1;
        }

        picture.setHeight(this.height);

        if (!this.widthSet) {
            this.width = -1;
        }

        picture.setWidth(this.width);

        reset();

        return picture;
    }
}
