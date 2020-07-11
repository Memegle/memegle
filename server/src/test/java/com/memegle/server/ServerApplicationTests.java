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
		// Update: fixed by downgrading elasticsearch to 6.8.7 (which seems to be the version used by spring-data)
		//         Will still keep an eye on the thread for latest changes.
	}

}
