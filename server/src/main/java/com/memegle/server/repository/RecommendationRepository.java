package com.memegle.server.repository;

import com.memegle.server.model.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends MongoRepository<Recommendation, String> {
}
