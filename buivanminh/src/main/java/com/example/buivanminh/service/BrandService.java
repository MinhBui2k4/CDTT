package com.example.buivanminh.service;

import com.example.buivanminh.dto.BrandDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface BrandService {
    BrandDTO createBrand(BrandDTO brandDTO);

    BrandDTO getBrandById(Long id);

    BaseResponse<BrandDTO> getAllBrands(int pageNumber, int pageSize, String sortBy, String sortOrder);

    BrandDTO updateBrand(Long id, BrandDTO brandDTO);

    void deleteBrand(Long id);
}
