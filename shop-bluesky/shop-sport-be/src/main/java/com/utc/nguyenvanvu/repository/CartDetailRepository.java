
package com.utc.nguyenvanvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.utc.nguyenvanvu.entity.Cart;
import com.utc.nguyenvanvu.entity.CartDetail;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
  @Query("SELECT cd FROM CartDetail cd WHERE cd.cart = :cart AND cd.product.productId IN :productIds")
  List<CartDetail> findByCartAndProductIdIn(@Param("cart") Cart cart, @Param("productIds") List<Long> productIds);

  List<CartDetail> findByCart(Cart cart);
//
//	void deleteByCart(Cart cart);

}
