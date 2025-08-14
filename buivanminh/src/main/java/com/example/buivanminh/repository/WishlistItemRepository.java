package com.example.buivanminh.repository;

import com.example.buivanminh.entity.WishlistItem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByWishlistIdAndProductId(Long wishlistId, Long productId);

    Page<WishlistItem> findByWishlistId(Long wishlistId, Pageable pageable);
}