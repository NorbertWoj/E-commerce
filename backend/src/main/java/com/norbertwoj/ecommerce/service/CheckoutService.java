package com.norbertwoj.ecommerce.service;

import com.norbertwoj.ecommerce.dto.Purchase;
import com.norbertwoj.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
