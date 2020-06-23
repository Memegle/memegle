package com.memegle.server.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;


// This class is not used for now
@Component
public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {
    private final static Logger LOGGER = LoggerFactory.getLogger(ApplicationStartup.class);

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        LOGGER.info("Application Started");
        LOGGER.info("BASE_URL is: " + Constants.BASE_URL);
    }

}
