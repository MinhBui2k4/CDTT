package com.example.buivanminh.service;

import com.example.buivanminh.dto.ContactDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface ContactService {
    ContactDTO createContact(ContactDTO contactDTO);

    BaseResponse<ContactDTO> getAllContacts(int pageNumber, int pageSize, String sortBy, String sortOrder);

    ContactDTO getContactById(Long id);

    ContactDTO updateContactStatus(Long id, String status);

    void deleteContact(Long id);
}