
package com.utc.nguyenvanvu.controller;

import java.util.Date;
import java.util.List;

import com.utc.nguyenvanvu.utils.SendMailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utc.nguyenvanvu.entity.Cart;
import com.utc.nguyenvanvu.entity.CartDetail;
import com.utc.nguyenvanvu.entity.Order;
import com.utc.nguyenvanvu.entity.OrderDetail;
import com.utc.nguyenvanvu.entity.Product;
import com.utc.nguyenvanvu.repository.CartDetailRepository;
import com.utc.nguyenvanvu.repository.CartRepository;
import com.utc.nguyenvanvu.repository.OrderDetailRepository;
import com.utc.nguyenvanvu.repository.OrderRepository;
import com.utc.nguyenvanvu.repository.ProductRepository;
import com.utc.nguyenvanvu.repository.UserRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("api/orders")
public class OrderController {

	@Autowired
	OrderRepository orderRepository;

	@Autowired
	OrderDetailRepository orderDetailRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	CartRepository cartRepository;

	@Autowired
	CartDetailRepository cartDetailRepository;

	@Autowired
	ProductRepository productRepository;

	@Autowired
	SendMailUtil senMail;
	// Lấy ra danh sách tất cả các đơn hàng
	@GetMapping
	public ResponseEntity<List<Order>> findAll() {
		return ResponseEntity.ok(orderRepository.findAllByOrderByOrdersIdDesc());
	}
	// lấy ra đơn hàng theo id
	@GetMapping("{id}")
	public ResponseEntity<Order> getById(@PathVariable("id") Long id) {
		if (!orderRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(orderRepository.findById(id).get());
	}

	@GetMapping("/user/{email}")
	public ResponseEntity<List<Order>> getByUser(@PathVariable("email") String email) {
		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity
				.ok(orderRepository.findByUserOrderByOrdersIdDesc(userRepository.findByEmail(email).get()));
	}
	// Đặt hàng
	@PostMapping("/{email}")
	public ResponseEntity<Order> checkout(@PathVariable("email") String email, @RequestBody Cart cart) {
		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		if (!cartRepository.existsById(cart.getCartId())) {
			return ResponseEntity.notFound().build();
		}
		List<CartDetail> items = cartDetailRepository.findByCart(cart);
		Double amount = 0.0;
		Double ship=30000D;
		for (CartDetail i : items) {
			amount += (i.getPrice() * i.getQuantity());
		}
		Order order = orderRepository.save(new Order(0L, new Date(), (amount+ship), cart.getAddress(), cart.getPhone(), 0,ship,
				userRepository.findByEmail(email).get()));
		for (CartDetail i : items) {
			OrderDetail orderDetail = new OrderDetail(0L, i.getQuantity(), i.getPrice(),i.getSize(),i.getProduct(),order);
			orderDetailRepository.save(orderDetail);
		}

		// xóa sản phẩm trong giỏ hàng đã chọn sau khi đặt thành công
		for (CartDetail i : items) {
			cartDetailRepository.delete(i);
		}
		//gửi thông tin đơn hàng về email khách hàng
		senMail.sendMailOrder(order);
		updateProduct(order);
		return ResponseEntity.ok(order);
	}
	//Trạng thái đã xác nhận
	@GetMapping("deliver/{orderId}")
	public ResponseEntity<Void> deliver(@PathVariable("orderId") Long id) {
		if (!orderRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		Order order = orderRepository.findById(id).get();
		order.setStatus(1);
		orderRepository.save(order);
		senMail.sendMailOrderDeliver(order);
		return ResponseEntity.ok().build();
	}
	//Trạng thái giao hàng thành công
	@GetMapping("success/{orderId}")
	public ResponseEntity<Void> success(@PathVariable("orderId") Long id) {
		if (!orderRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		Order order = orderRepository.findById(id).get();
		order.setStatus(2);
		orderRepository.save(order);
		updateProductSold(order);
		senMail.sendMailOrderSuccess(order);
		return ResponseEntity.ok().build();
	}
	//Trạng thái hủy đơn hàng
	@GetMapping("cancel/{orderId}")
	public ResponseEntity<Void> cancel(@PathVariable("orderId") Long id) {
		if (!orderRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		Order order = orderRepository.findById(id).get();
		order.setStatus(3);
		orderRepository.save(order);
		updateProductCancel(order);
		senMail.sendMailOrderCancel(order);
		return ResponseEntity.ok().build();
	}
	//cập nhật lại số lượng hàng sau đặt hàng
	public void updateProduct(Order order) {
		List<OrderDetail> listOrderDetail = orderDetailRepository.findByOrder(order);
		for (OrderDetail orderDetail : listOrderDetail) {
			Product product = productRepository.findById(orderDetail.getProduct().getProductId()).get();
			if (product != null) {
				product.setQuantity(product.getQuantity() - orderDetail.getQuantity());
//				product.setSold(product.getSold() + orderDetail.getQuantity());
				productRepository.save(product);
			}
		}
	}
	// cập nhật lại số lượng sau khi khách hàng hủy đơn
	public void updateProductCancel(Order order) {
		List<OrderDetail> listOrderDetail = orderDetailRepository.findByOrder(order);
		for (OrderDetail orderDetail : listOrderDetail) {
			Product product = productRepository.findById(orderDetail.getProduct().getProductId()).get();
			if (product != null) {
				product.setQuantity(product.getQuantity() + orderDetail.getQuantity());
//				product.setSold(product.getSold() + orderDetail.getQuantity());
				productRepository.save(product);
			}
		}
	}
	// cập nhật lại số lượng bán được khi xác nhận đã thanh toán đơn hàng
	public void updateProductSold(Order order) {
		List<OrderDetail> listOrderDetail = orderDetailRepository.findByOrder(order);
		for (OrderDetail orderDetail : listOrderDetail) {
			Product product = productRepository.findById(orderDetail.getProduct().getProductId()).get();
			if (product != null) {
//				product.setQuantity(product.getQuantity() - orderDetail.getQuantity());
				product.setSold(product.getSold() + orderDetail.getQuantity());
				productRepository.save(product);
			}
		}
	}

}
