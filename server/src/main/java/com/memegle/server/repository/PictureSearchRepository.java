package com.memegle.server.repository;

import com.memegle.server.model.PictureSearch;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureSearchRepository extends ElasticsearchRepository<PictureSearch, String> {
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"title\", \"texts\", \"tags\"]}}")
    List<PictureSearch> searchTitle(String title, Pageable pageable);
}
