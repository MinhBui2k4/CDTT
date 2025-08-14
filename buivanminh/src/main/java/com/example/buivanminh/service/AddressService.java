package com.example.buivanminh.service;

import com.example.buivanminh.dto.AddressDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO);

    BaseResponse<AddressDTO> getUserAddresses(int pageNumber, int pageSize, String sortBy, String sortOrder);

    AddressDTO getAddressById(Long id);

    AddressDTO updateAddress(Long id, AddressDTO addressDTO);

    void deleteAddress(Long id);

    AddressDTO setDefaultAddress(Long id);
}