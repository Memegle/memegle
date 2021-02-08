/*
 * Set up ES client
 */
package com.memegle.server.config;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;

@Configuration
public class EsClientConfig extends AbstractElasticsearchConfiguration {

    @Primary
    @Override
    @Bean
    public RestHighLevelClient elasticsearchClient() {
        String host = System.getenv("ES_HOST");
        String port = System.getenv("ES_PORT");
        String uri = System.getenv("ES_URI");

        HttpHost httpHost;
        if (host != null && port != null) {
            httpHost = new HttpHost(host, Integer.parseInt(port), "https");
        } else if (uri != null) {
            httpHost = HttpHost.create(uri);
        } else {
            httpHost = new HttpHost("localhost", 9200, "http");
        }

        String username = System.getenv("ES_USERNAME");
        String password = System.getenv("ES_PASSWORD");

        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        if (username != null && password != null) {
            credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
        }

        RestClientBuilder builder = RestClient.builder(httpHost)
                .setRequestConfigCallback(requestConfigBuilder -> requestConfigBuilder
                        .setConnectTimeout(5000)
                        .setSocketTimeout(120000)
                )
                .setHttpClientConfigCallback(httpAsyncClientBuilder -> httpAsyncClientBuilder
                        .setDefaultCredentialsProvider(credentialsProvider)
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
