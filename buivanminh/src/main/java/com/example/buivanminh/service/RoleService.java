package com.example.buivanminh.service;

import com.example.buivanminh.dto.RoleDTO;

import java.util.List;

public interface RoleService {

    List<RoleDTO> getAllRoles();

    RoleDTO getRoleById(Long id);

    RoleDTO saveRole(RoleDTO roleDTO);

    RoleDTO updateRole(Long id, RoleDTO roleDTO);

    void deleteRole(Long id);
}
