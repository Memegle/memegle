package com.memegle.server.util;

/**
 * Store all global constants
 * If you need to define more constants, add them to this file.
 */
public class Constants {
    public static final String BASE_URL = System.getenv("MEMEGLE_APP_PRODUCTION_MODE") != null &&
            System.getenv("MEMEGLE_APP_PRODUCTION_MODE").toLowerCase().equals("true") ?
            "http://memegle.qicp.vip:8080" : "http://localhost:8080";

    public static final String APP_DBNAME = "memegle";

    public final static String DATA_MAPPING = "/data";

    // Hide constructor
    private Constants() {}
}