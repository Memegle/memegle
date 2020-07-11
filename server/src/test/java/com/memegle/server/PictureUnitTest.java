package com.memegle.server;

import com.memegle.server.model.Picture;
import com.memegle.server.util.Constants;
import com.memegle.server.util.PictureBuilder;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.util.Date;

class PictureUnitTest {

    @Test
    void testPictureBuilder() throws Exception {
        PictureBuilder builder = new PictureBuilder();
        long id = 1;
        Date date = Date.from(Instant.parse("2000-01-01T00:00:00.000Z"));
        String urlSuffix = "/1.gif";
        String name = "おはよう！.gif";

        // Build picture with all fields populated
        Picture pic1 = builder.withId(id)
                .withDate(date)
                .withUrlSuffix(urlSuffix)
                .withName(name)
                .build();

        assertEquals(id, pic1.getId());
        assertEquals(date, pic1.getDateUpdated());
        assertEquals(name, pic1.getName());
        assertEquals(urlSuffix, pic1.getUrlSuffix());
        assertEquals(Constants.BASE_URL + Constants.DATA_MAPPING + urlSuffix, pic1.getFullUrl());

        // Picture builder should have been cleared
        assertThrows(Exception.class, () -> {
            Picture pp = builder.build();
        });

        // Missing Date
        Picture pic2 = builder.withId(id)
                .withUrlSuffix(urlSuffix)
                .withName(name)
                .build();

        // pic2 should be a brand new object
        assertNotSame(pic2, pic1);
        // Date should still be populated, checking gap with current time not greater than 10 seconds
        assertTrue((new Date()).getTime() - pic2.getDateUpdated().getTime() < 10000);
        assertEquals(id, pic2.getId());
        assertEquals(urlSuffix, pic2.getUrlSuffix());
        assertEquals(name, pic2.getName());

        // Missing url
        Picture pic3 = builder.withId(id)
                .withName(name)
                .withDate(date)
                .build();

        // urlSuffix should still be generated
        assertEquals(urlSuffix, pic3.getUrlSuffix());
        assertEquals(id, pic3.getId());
        assertEquals(name, pic3.getName());
        assertEquals(date, pic3.getDateUpdated());

        // Missing id
        assertThrows(Exception.class, () -> {
            Picture pp = builder.withName(name).withDate(date).withUrlSuffix(urlSuffix).build();
        });

        // builder can fail to clear due to previous exception
        builder.reset();

        // Missing name
        assertThrows(Exception.class, () -> {
            Picture pp = builder.withId(id).withDate(date).withUrlSuffix(urlSuffix).build();
        });
    }
}
