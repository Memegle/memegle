package com.memegle.server.Picture;

import com.memegle.server.ServerApplication;

import java.util.Date;

// Handle the logic for instantiation of Picture objects.
public class PictureBuilder {
    private long id;
    private String name;
    private Date date;
    private String url;

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

    public PictureBuilder withUrl(String url) {
        this.url = url;
        urlSet = true;

        return this;
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
        }

        picture.setDateUpdated(this.date);

        if (!urlSet) {
            this.url = ServerApplication.BASE_URL + PictureController.DATA_MAPPING + "/" + this.name;
        }

        picture.setUrl(this.url);

        return picture;
    }
}
