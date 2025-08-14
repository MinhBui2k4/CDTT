package com.example.buivanminh.service;

import java.io.FileNotFoundException;
import java.io.InputStream;

import com.example.buivanminh.dto.NewsDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface NewsService {
    NewsDTO createNews(NewsDTO newsDTO);

    BaseResponse<NewsDTO> getAllNews(int pageNumber, int pageSize, String search);

    NewsDTO getNewsById(Long id);

    NewsDTO updateNews(Long id, NewsDTO newsDTO);

    void deleteNews(Long id);

    public InputStream getNewsImage(String fileName) throws FileNotFoundException;
}