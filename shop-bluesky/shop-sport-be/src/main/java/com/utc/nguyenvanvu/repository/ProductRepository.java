
package com.utc.nguyenvanvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.utc.nguyenvanvu.entity.Category;
import com.utc.nguyenvanvu.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	List<Product> findByStatusTrue();
	@Query(value = "Select p.* From products p \r\n"
			+ "Order by  sold desc", nativeQuery = true)
	List<Product> findByStatusTrueOrderBySoldDesc();

	List<Product> findTop10ByOrderBySoldDesc();

	List<Product> findByStatusTrueOrderByQuantityDesc();

	List<Product> findByStatusTrueOrderByEnteredDateDesc();

	List<Product> findByCategory(Category category);

	Product findByProductIdAndStatusTrue(Long id);
	
	@Query(value = "Select p.* From products p \r\n"
			+ "left join rates r on p.product_id = r.product_id\r\n"
			+ "group by p.product_id , p.name\r\n"
			+ "Order by  avg(r.rating) desc", nativeQuery = true)
	List<Product> findProductRated();
	
	@Query(value = "(Select p.*, avg(r.rating) Rate From products p \r\n"
			+ "left join rates r on p.product_id = r.product_id\r\n"
			+ "Where (p.category_id = ?) and (p.product_id != ?)\r\n"
			+ "group by p.product_id , p.name)\r\n"
			+ "union\r\n"
			+ "(Select p.*, avg(r.rating) Rate From products p \r\n"
			+ "left join rates r on p.product_id = r.product_id\r\n"
			+ "Where p.category_id != ?\r\n"
			+ "group by p.product_id , p.name)\r\n"
			+ "Order by category_id = ? desc, Rate desc", nativeQuery = true)
	List<Product> findProductSuggest(Long id, Long id2, Long id3, Long id4) ;
	@Query(value = "Select * from products p order by p.entered_date desc limit :number",nativeQuery = true)
	List<Product> getListNewest(int number);

	
}
