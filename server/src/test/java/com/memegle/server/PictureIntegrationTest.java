package com.memegle.server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.memegle.server.controller.PictureController;
import com.memegle.server.dto.SearchQuery;
import com.memegle.server.repository.PictureRepository;
import com.memegle.server.util.Constants;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Repeat;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * https://reflectoring.io/spring-boot-test/
 */
@SpringBootTest
@AutoConfigureMockMvc
class PictureIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PictureRepository pictureRepo;

    @Test
    @Repeat(value = 5)
    void testPictureRandomRead() throws Exception {
        MvcResult result = mockMvc.perform(get("/random"))
                .andExpect(status().isOk())
                .andExpect(content().string(startsWith(Constants.BASE_URL)))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        // Extract picture id
        int l = response.lastIndexOf('/');
        int r = response.lastIndexOf('.');
        long id = Long.parseLong(response.substring(l+1, r));

        assertTrue(id < pictureRepo.count());

        mockMvc.perform(get(response))
                .andExpect(status().isOk());
    }


    @Test
    void testPictureSearch() throws Exception {
        SearchQuery query = new SearchQuery();
        query.keyword = "哈哈";

        MvcResult result = mockMvc.perform(post("/search")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(query)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]", startsWith(Constants.BASE_URL)))
                .andReturn();

        String url = JsonPath.read(result.getResponse().getContentAsString(), "$[0]");

        mockMvc.perform(get(url)).andExpect(status().isOk());
    }

    @Test
    void testPictureSearchWithNoResult() throws Exception {
        SearchQuery query = new SearchQuery();
        query.keyword = "嫑";

        mockMvc.perform(post("/search")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(query)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        query.keyword = "哈哈";

        mockMvc.perform(post("/search")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(query)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
