
package com.utc.nguyenvanvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utc.nguyenvanvu.entity.OrderDetail;
import com.utc.nguyenvanvu.entity.Product;
import com.utc.nguyenvanvu.entity.Rate;

@Repository
public interface RateRepository extends JpaRepository<Rate, Long> {

	List<Rate> findAllByOrderByIdDesc();

	Rate findByOrderDetail(OrderDetail orderDetail);

	List<Rate> findByProductOrderByIdDesc(Product product);

}
