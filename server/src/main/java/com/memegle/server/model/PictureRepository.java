package com.memegle.server.model;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface PictureRepository extends MongoRepository<Picture, Long> {

    public Picture findById(long id);

    public Collection<Picture> findByName(String name);
}
