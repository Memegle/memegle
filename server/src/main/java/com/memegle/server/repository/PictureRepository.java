package com.memegle.server.repository;

import com.memegle.server.model.Picture;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureRepository extends MongoRepository<Picture, ObjectId> {
    public List<Picture> findByTitle(String title);
}