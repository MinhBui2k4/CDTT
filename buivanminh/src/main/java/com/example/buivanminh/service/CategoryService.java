package com.example.buivanminh.service;

import com.example.buivanminh.dto.CategoryDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO getCategoryById(Long id);

    BaseResponse<CategoryDTO> getAllCategories(int pageNumber, int pageSize, String sortBy, String sortOrder);

    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);

    void deleteCategory(Long id);
}
