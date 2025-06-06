
package com.utc.nguyenvanvu.controller;

import java.util.List;

import com.utc.nguyenvanvu.entity.Category;
import com.utc.nguyenvanvu.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("api/categories")
public class CategoryController {

	@Autowired
	CategoryRepository repo;

	@GetMapping
	public ResponseEntity<List<Category>> getAll() {
		return ResponseEntity.ok(repo.findAll());
	}
	//Lấy thông tin danh mục sản phẩm theo id
	@GetMapping("{id}")
	public ResponseEntity<Category> getById(@PathVariable("id") Long id) {
		if (!repo.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(repo.findById(id).get());
	}
	// Thêm loại sản phẩm vào danh mục sản phẩm
	@PostMapping
	public ResponseEntity<Category> post(@RequestBody Category category) {
		if (repo.existsById(category.getCategoryId())) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(repo.save(category));
	}
	// cập nhật thông tin danh mục sản phẩm theo id
	@PutMapping("{id}")
	public ResponseEntity<Category> put(@RequestBody Category category, @PathVariable("id") Long id) {
		if (!id.equals(category.getCategoryId())) {
			return ResponseEntity.badRequest().build();
		}
		if (!repo.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(repo.save(category));
	}
	// xóa danh sách mục sản phẩm theo id
	@DeleteMapping("{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		if (!repo.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repo.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
