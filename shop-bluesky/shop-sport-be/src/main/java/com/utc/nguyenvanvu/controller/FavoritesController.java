
package com.utc.nguyenvanvu.controller;

import java.util.List;

import com.utc.nguyenvanvu.entity.Favorite;
import com.utc.nguyenvanvu.entity.Product;
import com.utc.nguyenvanvu.entity.User;
import com.utc.nguyenvanvu.repository.FavoriteRepository;
import com.utc.nguyenvanvu.repository.ProductRepository;
import com.utc.nguyenvanvu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("api/favorites")
public class FavoritesController {

	@Autowired
	FavoriteRepository favoriteRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	ProductRepository productRepository;
	// Lấy ra danh sách sản phẩm yêu thích theo email
	@GetMapping("email/{email}")
	public ResponseEntity<List<Favorite>> findByEmail(@PathVariable("email") String email) {
		if (userRepository.existsByEmail(email)) {
			return ResponseEntity.ok(favoriteRepository.findByUser(userRepository.findByEmail(email).get()));
		}
		return ResponseEntity.notFound().build();
	}
	@GetMapping("product/{id}")
	public ResponseEntity<Integer> findByProduct(@PathVariable("id") Long id) {
		if (productRepository.existsById(id)) {
			return ResponseEntity.ok(favoriteRepository.countByProduct(productRepository.getById(id)));
		}
		return ResponseEntity.notFound().build();
	}
	// lấy ra sản phẩm yêu thích theo mã sản phẩm và email khách hàng
	@GetMapping("{productId}/{email}")
	public ResponseEntity<Favorite> findByProductAndUser(@PathVariable("productId") Long productId,
			@PathVariable("email") String email) {
		if (userRepository.existsByEmail(email)) {
			if (productRepository.existsById(productId)) {
				Product product = productRepository.findById(productId).get();
				User user = userRepository.findByEmail(email).get();
				return ResponseEntity.ok(favoriteRepository.findByProductAndUser(product, user));
			}
		}
		return ResponseEntity.notFound().build();
	}
	// Thêm sản phẩm yêu thích
	@PostMapping("email")
	public ResponseEntity<Favorite> post(@RequestBody Favorite favorite) {
		return ResponseEntity.ok(favoriteRepository.save(favorite));
	}
	//Xóa sản phẩm yêu thích
	@DeleteMapping("{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		if (favoriteRepository.existsById(id)) {
			favoriteRepository.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

}
