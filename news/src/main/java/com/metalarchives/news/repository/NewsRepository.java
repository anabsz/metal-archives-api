package com.metalarchives.news.repository;

import com.metalarchives.news.model.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository 
public interface NewsRepository extends JpaRepository<NewsArticle, Long>{
    List<NewsArticle> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);
    
}
