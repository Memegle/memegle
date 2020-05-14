package com.memegle.server.Picture;

import com.memegle.server.Picture.Picture;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureRepository extends MongoRepository<Picture, Long> {

    public Picture findById(long id);

    public List<Picture> findByName(String name);
}
