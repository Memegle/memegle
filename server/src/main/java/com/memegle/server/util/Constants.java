package com.memegle.server.util;

/**
 * Store all global constants
 * If you need to define more constants, add them to this file.
 */
public class Constants {
    public static final String BASE_URL = getServerUrl();

    public static final String IMAGE_MAPPING = "/img";

    // Hide constructor
    private Constants() {}

    private static String getServerUrl() {
        if ("production".equals(System.getenv("MEMEGLE_APP_MODE"))) {
            return "https://memegle.live:8080";
        }
        
        return "http://localhost:8080";
    }
}
