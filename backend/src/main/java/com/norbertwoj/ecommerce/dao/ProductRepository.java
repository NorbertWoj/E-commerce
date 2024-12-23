package com.norbertwoj.ecommerce.dao;

import com.norbertwoj.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
