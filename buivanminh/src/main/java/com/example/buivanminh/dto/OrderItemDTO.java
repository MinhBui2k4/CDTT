package com.example.buivanminh.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderItemDTO {
    private Long id;

    private Long orderId;

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be positive")
    private Long productId;

    private String productName;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be positive or zero")
    private Double price;
}