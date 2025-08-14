package com.example.buivanminh.service;

import com.example.buivanminh.dto.HeroSectionDTO;
import com.example.buivanminh.dto.response.BaseResponse;

import java.io.FileNotFoundException;
import java.io.InputStream;

public interface HeroSectionService {
    HeroSectionDTO createHeroSection(HeroSectionDTO dto);

    BaseResponse<HeroSectionDTO> getAllHeroSections(int pageNumber, int pageSize);

    HeroSectionDTO getHeroSectionById(Long id);

    HeroSectionDTO updateHeroSection(Long id, HeroSectionDTO dto);

    void deleteHeroSection(Long id);

    InputStream getHeroImage(String fileName) throws FileNotFoundException;
}
