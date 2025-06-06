package com.utc.nguyenvanvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.utc.nguyenvanvu.entity.Image;
import com.utc.nguyenvanvu.entity.Product;

import java.util.List;

public interface ImageReposity extends JpaRepository<Image,Long> {
    List<Image> findByProduct(Product product);
}
