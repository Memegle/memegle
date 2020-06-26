package com.memegle.server;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// read this tutorial https://www.baeldung.com/spring-boot-testing
@SpringBootTest
class ServerApplicationTests {

	@Test
	void contextLoads() {
		// Paul: currently the test cannot be passed successfully due to an elasticsearch warning.
		// I'm following these two threads and hoping to get a solution.
		// https://github.com/elastic/elasticsearch/issues/54501

	}

}
