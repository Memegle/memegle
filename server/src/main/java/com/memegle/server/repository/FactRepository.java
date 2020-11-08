package com.memegle.server.repository;

import com.memegle.server.model.Fact;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FactRepository extends MongoRepository<Fact, ObjectId> {
    public Fact findByText(String text);
}
