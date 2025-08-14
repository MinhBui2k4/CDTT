package com.example.buivanminh.service;

import com.example.buivanminh.dto.WishlistItemDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface WishlistService {
    BaseResponse<WishlistItemDTO> addItemToWishlist(WishlistItemDTO wishlistItemDTO);

    BaseResponse<WishlistItemDTO> getWishlist(int pageNumber, int pageSize);

    BaseResponse<WishlistItemDTO> removeItemFromWishlist(Long productId);

    void clearWishlist();
}