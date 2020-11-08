package com.memegle.server.repository;

import com.memegle.server.model.Search;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SearchRepository extends MongoRepository<Search, String> {
}
