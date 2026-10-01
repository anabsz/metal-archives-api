package com.metalarchives.news.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity 
@Table(name = "news")
@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class NewsArticle {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDate publishedAt;
}
