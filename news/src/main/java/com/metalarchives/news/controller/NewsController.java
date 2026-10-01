package com.metalarchives.news.controller;

import com.metalarchives.news.model.NewsArticle;
import com.metalarchives.news.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController 
@RequestMapping("/api/news")
public class NewsController {
    @Autowired 
    private NewsRepository newsRepository;

    @GetMapping 
    public List<NewsArticle> getNews(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) 
            return newsRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(search, search);
        return newsRepository.findAll();
    }
}
