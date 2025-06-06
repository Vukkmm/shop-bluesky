
package com.utc.nguyenvanvu.controller;

import java.util.List;

import com.utc.nguyenvanvu.entity.Category;
import com.utc.nguyenvanvu.entity.Product;
import com.utc.nguyenvanvu.repository.CategoryRepository;
import com.utc.nguyenvanvu.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("api/products")
public class ProductController {

    @Autowired
    ProductRepository repo;

    @Autowired
    CategoryRepository cRepo;


    // Lấy ra tất cả các sản phẩm

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(repo.findByStatusTrue());
    }

    // Lấy ra sản phẩm bán chạy theo tiêu chí số lượt bán nhiều nhất
    @GetMapping("bestseller")
    public ResponseEntity<List<Product>> getBestSeller() {
        return ResponseEntity.ok(repo.findByStatusTrueOrderBySoldDesc());
    }

    //lấy ra sản phẩm bán chạy lấy ra top 10 sản phẩm đầu đã bán
    @GetMapping("bestseller-admin")
    public ResponseEntity<List<Product>> getBestSellerAdmin() {
        return ResponseEntity.ok(repo.findTop10ByOrderBySoldDesc());
    }
    @GetMapping("all-admin")
    public ResponseEntity<List<Product>> getAllAdmin() {
        return ResponseEntity.ok(repo.findAll());
    }

    // lấy ra danh sách sản phẩm nổi bật nhất
    @GetMapping("latest")
    public ResponseEntity<List<Product>> getLasted() {
        return ResponseEntity.ok(repo.findByStatusTrueOrderByEnteredDateDesc());
    }

    // lấy sản danh sách phẩm thịnh hành theo tiêu chí có trung bình đánh giá tốt nhất
    @GetMapping("rated")
    public ResponseEntity<List<Product>> getRated() {
        return ResponseEntity.ok(repo.findProductRated());
    }

    // Lấy sản phẩm theo mã danh mục và mã sản phẩm
    @GetMapping("suggest/{categoryId}/{productId}")
    public ResponseEntity<List<Product>> suggest(@PathVariable("categoryId") Long categoryId,
                                                 @PathVariable("productId") Long productId) {
        return ResponseEntity.ok(repo.findProductSuggest(categoryId, productId, categoryId, categoryId));
    }
    //Lấy danh sách sản phẩm theo mã danh mục
    @GetMapping("category/{id}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable("id") Long id) {
        if (!cRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Category c = cRepo.findById(id).get();
        return ResponseEntity.ok(repo.findByCategory(c));
    }
    // lấy sản phẩm theo id
    @GetMapping("{id}")
    public ResponseEntity<Product> getById(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.findById(id).get());
    }
    // thêm sản phẩm
    @PostMapping
    public ResponseEntity<Product> post(@RequestBody Product product) {
        if (repo.existsById(product.getProductId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repo.save(product));
    }
    //  cập nhật thông tin sản phẩm theo id
    @PutMapping("{id}")
    public ResponseEntity<Product> put(@PathVariable("id") Long id, @RequestBody Product product) {
        if (!id.equals(product.getProductId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.save(product));
    }
    // xóa sản phẩm theo id
    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Product p = repo.findById(id).get();
        p.setStatus(false);
        repo.save(p);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/newest/{number}")
    @Operation(summary="Lấy ra danh sách sản phẩm mới nhất giới hạn số lượng = number")
    public ResponseEntity<List<Product>> getListNewst(@PathVariable int number){
        List<Product> list =repo.getListNewest(number);
        return ResponseEntity.ok(list);
    }

//    @PutMapping("/uploadImage")
//    public ResponseEntity<?> uploadImage(@Valid @RequestBody Product productRequest) {
//        try {
//            if (productRequest.getProductId() == null) {
//                return ResponseEntity.badRequest()
//                        .body(new MessageResponse("Lỗi: Không tìm thấy người dùng để thay đổi hình đại diện !"));
//            }
//            Optional<Product> product = repo.findById(productRequest.getProductId());
//            if (!product.isPresent()) {
//                return ResponseEntity.badRequest()
//                        .body(new MessageResponse("Lỗi: Không tìm thấy người dùng để đổi mật khẩu!"));
//            }
//            product.get().setImageBase64(productRequest.getImageBase64());
//            repo.save(product.get());
//            return ResponseEntity.ok(new MessageResponse("Đổi hình đại diện người dùng thành công!"));
//        } catch (Exception ex) {
//            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Có lỗi xảy ra trong quá trình xử lý!"));
//        }
//    }


}