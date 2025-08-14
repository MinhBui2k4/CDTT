package com.example.buivanminh.service;

import com.example.buivanminh.dto.response.*;
import com.example.buivanminh.entity.Order;

import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO);

    OrderResponseDTO createOrderFromCart(Long paymentMethodId, Long shippingAddressId, Double shippingCost);

    BaseResponse<OrderResponseDTO> getOrdersByStatus(Order.OrderStatus status, Pageable pageable);

    BaseResponse<OrderResponseDTO> getUserOrders(Pageable pageable);

    OrderResponseDTO getOrderById(Long id);

    OrderResponseDTO cancelOrder(Long id);

    OrderResponseDTO updateOrderStatus(Long id, String status);

    BaseResponse<OrderResponseDTO> getAllOrders(Pageable pageable);

    BaseResponse<OrderResponseDTO> getOrdersByUserIdAndStatus(Long userId, Order.OrderStatus status, Pageable pageable);

    Order findOrderEntityById(Long id); // New method to fetch Order entity
}