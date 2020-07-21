/**
 * Class used to configure MVC, mapping new request directories.
 */

package com.memegle.server.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
@AutoConfigureAfter(WebMvcAutoConfiguration.class)
public class MvcConfig implements WebMvcConfigurer {
    private static final Logger LOGGER = LoggerFactory.getLogger(MvcConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String dataPath = "server/data/processed/";
        File file = new File(dataPath);
        dataPath = file.exists() ? "file:///" + file.getAbsolutePath().replaceAll("\\\\", "/") + "/"
                : "file:/root/memegle/images/";
        LOGGER.info("dataPath is: " + dataPath);
        registry.addResourceHandler("/img/**").addResourceLocations(dataPath);
    }
}
