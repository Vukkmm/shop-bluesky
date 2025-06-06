
package com.utc.nguyenvanvu.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.utc.nguyenvanvu.entity.Cart;
import com.utc.nguyenvanvu.entity.CartDetail;
import com.utc.nguyenvanvu.entity.Product;
import com.utc.nguyenvanvu.repository.CartDetailRepository;
import com.utc.nguyenvanvu.repository.CartRepository;
import com.utc.nguyenvanvu.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("api/cartDetail")
public class CartDetailController {

	@Autowired
	CartDetailRepository cartDetailRepository;

	@Autowired
	CartRepository cartRepository;

	@Autowired
	ProductRepository productRepository;
  @GetMapping("cart/{id}")
  public ResponseEntity<List<CartDetail>> getByCartId(
        @PathVariable("id") Long id,
        @RequestParam(value = "productIds", required = false) String productIdsString) {
    if (!cartRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }

    // Lấy giỏ hàng từ id
    Cart cart = cartRepository.findById(id).orElse(null);
    if (cart == null) {
      return ResponseEntity.notFound().build();
    }

    List<CartDetail> cartDetails;

    if (productIdsString != null && !productIdsString.isEmpty()) {
      // Split chuỗi productIdsString thành một danh sách các productId
      List<Long> productIds = Arrays.stream(productIdsString.split(","))
            .map(Long::parseLong)
            .collect(Collectors.toList());

      // Gọi phương thức findByCartAndProductIdIn trong CartDetailRepository
      cartDetails = cartDetailRepository.findByCartAndProductIdIn(cart, productIds);
    } else {
      // Nếu không có productIdsString, lấy tất cả các mục trong giỏ hàng
      cartDetails = cartDetailRepository.findByCart(cart);
    }

    return ResponseEntity.ok(cartDetails);
  }

  @RequestMapping(value = "{id}", method = RequestMethod.GET)
	public ResponseEntity<CartDetail> getOne(@PathVariable("id") Long id) {
		if (!cartDetailRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(cartDetailRepository.findById(id).get());
	}
	// Thêm sản phẩm vào giỏ hàng
	@PostMapping()
	public ResponseEntity<CartDetail> post(@RequestBody CartDetail detail) {
		if (!cartRepository.existsById(detail.getCart().getCartId())) {
			return ResponseEntity.notFound().build();
		}
		boolean check = false;
		List<Product> listP = productRepository.findByStatusTrue();
		Product product = productRepository.findByProductIdAndStatusTrue(detail.getProduct().getProductId());
		for (Product p : listP) {
			if (p.getProductId() == product.getProductId()) {
				check = true;
			}
		}

		if (!check) {
			return ResponseEntity.notFound().build();
		}
		List<CartDetail> listD = cartDetailRepository
				.findByCart(cartRepository.findById(detail.getCart().getCartId()).get());
		for (CartDetail item : listD) {
			String a=item.getSize();
			String b=detail.getSize();
			if ((item.getProduct().getProductId() == detail.getProduct().getProductId()) && (a.equals(b))) {
				item.setQuantity(item.getQuantity() + 1);
				item.setPrice(item.getPrice() + detail.getPrice());
//				log.info("logg: {}", item.getPrice() + (detail.getPrice() * detail.getQuantity()));
//				item.setPrice(item.getPrice() + (detail.getPrice() * detail.getQuantity()));
				return ResponseEntity.ok(cartDetailRepository.save(item));
			}
		}
		return ResponseEntity.ok(cartDetailRepository.save(detail));
	}
	//Cập nhật lại thông tin giỏ hàng
	@PutMapping()
	public ResponseEntity<CartDetail> put(@RequestBody CartDetail detail) {
		if (!cartRepository.existsById(detail.getCart().getCartId())) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(cartDetailRepository.save(detail));
	}
	// Xóa sản phẩm trong giỏ hàng
	@DeleteMapping("{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		log.info("(delete) id: {}", id);
		if (!cartDetailRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		cartDetailRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
