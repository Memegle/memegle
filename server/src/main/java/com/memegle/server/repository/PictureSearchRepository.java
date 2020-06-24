package com.memegle.server.repository;

import com.memegle.server.model.PictureSearch;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureSearchRepository extends ElasticsearchRepository<PictureSearch, Long> {
    @Query("{\"match\": {\"name\": \"?0\"}}")
    public List<PictureSearch> searchName(String name, Pageable pageable);
}
