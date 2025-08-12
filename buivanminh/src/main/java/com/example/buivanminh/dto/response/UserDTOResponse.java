package com.example.buivanminh.dto.response;

import com.example.buivanminh.dto.AddressDTO;
import com.example.buivanminh.dto.CartDTO;
import com.example.buivanminh.dto.RoleDTO;
import com.example.buivanminh.dto.WishlistDTO;

import lombok.Data;

import java.util.List;

@Data
public class UserDTOResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private List<AddressDTO> addresses;
    private List<RoleDTO> roles;
    private CartDTO cart;
    private List<OrderResponseDTO> orders;
    private WishlistDTO wishlist; // Add this field
}