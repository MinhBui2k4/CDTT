package com.example.buivanminh.repository;

import com.example.buivanminh.entity.OrderTimeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderTimelineRepository extends JpaRepository<OrderTimeline, Long> {
    List<OrderTimeline> findByOrderId(Long orderId);
}