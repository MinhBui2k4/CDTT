package com.example.buivanminh.service;

import com.example.buivanminh.dto.CartDTO;
import com.example.buivanminh.dto.CartItemDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface CartService {
    BaseResponse<CartDTO> getCart();

    BaseResponse<CartDTO> addItemToCart(CartItemDTO cartItemDTO);

    BaseResponse<CartDTO> updateCartItem(Long itemId, CartItemDTO cartItemDTO);

    BaseResponse<CartDTO> removeItemFromCart(Long itemId);

    void clearCart();
}