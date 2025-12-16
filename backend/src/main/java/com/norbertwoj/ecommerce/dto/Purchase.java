package com.norbertwoj.ecommerce.dto;

import com.norbertwoj.ecommerce.entity.Address;
import com.norbertwoj.ecommerce.entity.Customer;
import com.norbertwoj.ecommerce.entity.Order;
import com.norbertwoj.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
