
package com.utc.nguyenvanvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utc.nguyenvanvu.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{

}