package com.memegle.server;

import com.github.cloudyrock.mongock.SpringBootMongock;
import com.github.cloudyrock.mongock.SpringBootMongockBuilder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.filter.CharacterEncodingFilter;

@SpringBootApplication
public class ServerApplication {
	public static final String BASE_URL = "http://memegle.qicp.vip";
	public static final String APP_DBNAME = "memegle";
	public static String STATIC_RESOURCES_PATH;

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	// Set default encoding to utf-8
	@Bean
	public CharacterEncodingFilter characterEncodingFilter() {
		final CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
		characterEncodingFilter.setEncoding("UTF-8");
		characterEncodingFilter.setForceEncoding(true);
		return characterEncodingFilter;
	}

	// Runner for MongoBee
	@Bean
	public SpringBootMongock mongock(MongoTemplate mongoTemplate, ApplicationContext springContext) {
		return new SpringBootMongockBuilder(mongoTemplate, "com.memegle.server.DbHelper")
				.setApplicationContext(springContext)
				.setLockQuickConfig()
				.build();
	}
}
