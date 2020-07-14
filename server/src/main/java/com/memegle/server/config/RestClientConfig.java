/**
 * Set up the client to connect to Elasticsearch
 */
package com.memegle.server.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;

@Configuration
public class RestClientConfig extends AbstractElasticsearchConfiguration {

    @Override
    @Bean
    public RestHighLevelClient elasticsearchClient() {
        String url = System.getenv("ES_URI");
        if (url == null) {
            url = "localhost:9200";
        }

        RestClientBuilder builder = RestClient.builder(HttpHost.create(url))
                .setRequestConfigCallback(requestConfigBuilder -> requestConfigBuilder
                        .setConnectTimeout(5000)
                        .setSocketTimeout(120000)
                );

        return new RestHighLevelClient(builder);
    }

    @Bean
    public ElasticsearchOperations elasticsearchTemplate(RestHighLevelClient client) {
        return new ElasticsearchRestTemplate(client);
    }

    // Make RestClient available to actuator
    // according to this post: https://stackoverflow.com/a/55099492/10837478
    @Bean(destroyMethod = "close")
    public RestClient restClient(RestHighLevelClient highLevelClient) {
        return highLevelClient.getLowLevelClient();
    }
}
