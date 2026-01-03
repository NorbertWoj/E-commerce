package com.norbertwoj.ecommerce.service;

import com.norbertwoj.ecommerce.dto.PaymentInfo;
import com.norbertwoj.ecommerce.dto.Purchase;
import com.norbertwoj.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
