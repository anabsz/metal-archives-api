package com.metalarchives.news.controller;

import com.metalarchives.news.model.NewsArticle;
import com.metalarchives.news.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsRepository newsRepository;

    // READ ALL / SEARCH
    @GetMapping
    public List<NewsArticle> getNews(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return newsRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(search, search);
        }
        return newsRepository.findAll();
    }

    // READ BY ID (Usando newsRepository em vez de newsService)
    @GetMapping("/{id}")
    public ResponseEntity<NewsArticle> getById(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public ResponseEntity<NewsArticle> create(@RequestBody NewsArticle news) {
        NewsArticle saved = newsRepository.save(news);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<NewsArticle> update(@PathVariable Long id, @RequestBody NewsArticle newsDetails) {
        return newsRepository.findById(id)
                .map(existingNews -> {
                    existingNews.setTitle(newsDetails.getTitle());
                    existingNews.setContent(newsDetails.getContent());
                    NewsArticle updated = newsRepository.save(existingNews);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (newsRepository.existsById(id)) {
            newsRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
