package com.example.buivanminh.service;

import java.io.FileNotFoundException;
import java.io.InputStream;

import com.example.buivanminh.dto.AdminCreateUserDTO;
import com.example.buivanminh.dto.ChangePasswordDTO;
import com.example.buivanminh.dto.RegisterDTO;
import com.example.buivanminh.dto.UserDTO;
import com.example.buivanminh.dto.response.BaseResponse;
import com.example.buivanminh.dto.response.UserDTORequest;
import com.example.buivanminh.dto.response.UserDTOResponse;

public interface UserService {

    UserDTO registerUser(RegisterDTO registerDTO);

    UserDTO createUserByAdmin(AdminCreateUserDTO createUserDTO);

    BaseResponse<UserDTO> getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserDTO getUserById(Long userId);

    UserDTO getUserById(Long userId, boolean includeOrders);

    UserDTO getUserByEmail(String email);

    public UserDTOResponse updateUser(Long userId, UserDTORequest userDTO);

    String deleteUser(Long userId);

    public UserDTO getProfile();

    public InputStream getAvatar(String fileName) throws FileNotFoundException;

    void changePassword(ChangePasswordDTO changePasswordDTO);

}