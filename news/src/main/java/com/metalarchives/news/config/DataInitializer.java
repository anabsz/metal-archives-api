package com.metalarchives.news.config;

import com.metalarchives.news.model.NewsArticle;
import com.metalarchives.news.repository.NewsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(NewsRepository repository) {
        return args -> {
            repository.saveAll(List.of(
                new NewsArticle(null, "Iron Maiden anuncia nova turnê mundial para 2027", "A lendária banda de heavy metal fará 30 shows na América Latina.", LocalDate.now()),
                new NewsArticle(null, "Lançamento do novo álbum do Black Sabbath com gravações inéditas", "Material raro dos anos 70 foi restaurado em estúdio.", LocalDate.now()),
                new NewsArticle(null, "Festival Wacken Open Air confirma 20 bandas de Death Metal", "O maior festival do gênero esgotou ingressos em poucas horas.", LocalDate.now())
            ));
        };
    };
}