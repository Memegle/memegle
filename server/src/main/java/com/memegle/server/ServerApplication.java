package com.memegle.server;

import com.github.cloudyrock.mongock.SpringBootMongock;
import com.github.cloudyrock.mongock.SpringBootMongockBuilder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.filter.CharacterEncodingFilter;

@SpringBootApplication(exclude = RepositoryRestMvcAutoConfiguration.class)
public class ServerApplication {
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
		return new SpringBootMongockBuilder(mongoTemplate, "com.memegle.server.changeLogs")
				.setApplicationContext(springContext)
				.setLockQuickConfig()
				.build();
	}
}
