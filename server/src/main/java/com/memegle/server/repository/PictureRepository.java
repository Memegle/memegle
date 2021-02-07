package com.memegle.server.repository;

import com.memegle.server.model.Picture;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureRepository extends MongoRepository<Picture, Long> {

    public Picture findById(String id);

    public List<Picture> findByTitle(String title);
}
