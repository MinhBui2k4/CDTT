package com.example.buivanminh.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.*;

@Data
public class OrderDTO {
    private Long id;

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userId;

    private LocalDateTime orderDate;

    private String status;

    @PositiveOrZero(message = "Total must be positive or zero")
    private Double total;

    @PositiveOrZero(message = "Shipping cost must be positive or zero")
    private Double shippingCost;

    @NotNull(message = "Payment method ID is required")
    @Positive(message = "Payment method ID must be positive")
    private Long paymentMethodId;

    @NotNull(message = "Shipping address ID is required")
    @Positive(message = "Shipping address ID must be positive")
    private Long shippingAddressId;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDTO> items;

    private List<OrderTimelineDTO> timeline;
}