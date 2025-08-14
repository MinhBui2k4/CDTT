package com.example.buivanminh.service;

import com.example.buivanminh.dto.PaymentMethodDTO;
import com.example.buivanminh.dto.response.BaseResponse;

public interface PaymentMethodService {
    PaymentMethodDTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO);

    BaseResponse<PaymentMethodDTO> getAllPaymentMethods(int pageNumber, int pageSize, String sortBy, String sortOrder);

    PaymentMethodDTO getPaymentMethodById(Long id);

    PaymentMethodDTO updatePaymentMethod(Long id, PaymentMethodDTO paymentMethodDTO);

    void deletePaymentMethod(Long id);
}