package com.memegle.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {
	public static final String BASE_URL = "127.0.0.1:8080";

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}
