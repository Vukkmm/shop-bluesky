import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { Product } from '../../common/Product';
import { CartService } from '../../services/cart.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  product!: Product;
  discount!: number;
  amount!: number;
  amountReal!: number;
  quantity: number = 1;
  error: string = '';

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.discount = 0;
    this.amount = 0;
    this.amountReal = 0;
    this.getAllItem();
  }
  getAllItem() {
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe((data) => {
      this.cart = data as Cart;
      this.cartService.getAllDetail(this.cart.cartId, '').subscribe((data) => {
        this.cartDetails = data as CartDetail[];
        console.log(this.cartDetails);
        this.cartService.setLength(this.cartDetails.length);
        this.cartDetails.forEach((item) => {
          this.amountReal += item.product.price * item.quantity;
        });
        this.discount = this.amount - this.amountReal;
      });
    });
  }
  update(id: number, quantity: number) {
    this.cartService.getOneDetail(id).subscribe(
      (data) => {
        let cartDetail = data as CartDetail;
        if (quantity >= cartDetail.product.quantity) {
          this.toastr.warning(
            'Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này'
          );
          quantity = cartDetail.product.quantity;
        }
        cartDetail.quantity = quantity;
        this.cartService.updateDetail(cartDetail).subscribe(
          (data) => {
            this.getAllItem(); // Reload cart details after updating
          },
          (error) => {
            this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
          }
        );
      },
      (error) => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      }
    );
  }
  // update(id: number, quantity: number) {
  //   this.cartService.getOneDetail(id).subscribe(
  //     (data) => {
  //       this.cartDetail = data as CartDetail;
  //       if (
  //         quantity >= this.cartDetail.product.quantity ||
  //         quantity == this.cartDetail.product.quantity
  //       ) {
  //         this.toastr.warning(
  //           'Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này'
  //         );

  //         this.cartDetail.quantity = this.cartDetail.product.quantity;
  //         this.cartDetail.price =
  //           this.cartDetail.product.price *
  //           (1 - this.cartDetail.product.discount / 100) *
  //           this.cartDetail.quantity;
  //         this.cartService.updateDetail(this.cartDetail).subscribe(
  //           (data) => {
  //             this.ngOnInit();
  //           },
  //           (error) => {
  //             this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
  //           }
  //         );
  //       } else {
  //         this.cartDetail.quantity = quantity;
  //         this.cartDetail.price =
  //           this.cartDetail.product.price *
  //           (1 - this.cartDetail.product.discount / 100) *
  //           this.cartDetail.quantity;
  //         this.cartService.updateDetail(this.cartDetail).subscribe(
  //           (data) => {
  //             this.ngOnInit();
  //           },
  //           (error) => {
  //             this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
  //           }
  //         );
  //       }
  //     },
  //     (error) => {
  //       this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
  //     }
  //   );
  //   this.cartDetail.checked = true; // Đánh dấu đã chọn
  //   this.updateTotal(); // Sau khi cập nhật, tính lại tổng tiền
  // }
  // updateTotal() {
  //   this.amount = 0; // Đặt lại tổng tiền
  //   this.cartDetails.forEach((item) => {
  //     if (item.checked) {
  //       // Nếu item đã được chọn
  //       this.amount += item.price; // Thêm giá tiền của item vào tổng tiền
  //     }
  //   });
  //   this.discount = this.amountReal - this.amount; // Cập nhật lại giá trị giảm giá
  // }
  // updateTotal() {
  //   this.amount = this.calculateTotalPrice() + 30000;
  // }
  updateTotal() {
    this.amount = this.calculateTotalPrice() + 30000;
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.cartDetails.forEach((item) => {
      if (item.checked) {
        totalPrice += item.price * item.quantity;
      }
    });
    return totalPrice;
  }
  // calculateAmount(): number {
  //   this.amount = 0;
  //   this.cartDetails.forEach((item) => {
  //     this.amount += item.price * item.quantity;
  //   });
  //   // Add discount to the total amount
  //  return this.amount += this.discount;
  // }

  calculateTotalDiscount(): number {
    return 30000;
  }

  // delete(id: number) {
  //   Swal.fire({
  //     title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     cancelButtonText: 'Không',
  //     confirmButtonText: 'Xoá',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.cartService.deleteDetail(id).subscribe(
  //         (data) => {
  //           this.toastr.success('Xoá thành công!', 'Hệ thống');
  //           this.ngOnInit();
  //         },
  //         (error) => {
  //           this.toastr.error('Xoá thất bại! ' + error.status, 'Hệ thống');
  //         }
  //       );
  //     }
  //   });
  // }
  delete(id: number) {
    Swal.fire({
      title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Xoá',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteDetail(id).subscribe(
          (data) => {
            this.toastr.success('Xoá thành công!', 'Hệ thống');
            this.getAllItem(); // Reload cart details after deleting
          },
          (error) => {
            this.toastr.error('Xoá thất bại! ' + error.status, 'Hệ thống');
          }
        );
      }
    });
  }
  SendProductBuy() {
    const selectedProducts: number[] = [];
    let checkedChoose = 0;
    this.cartDetails.forEach((item) => {
      if (item.checked) {
        selectedProducts.push(item.product.productId);
        checkedChoose++;
      }
    });
    if (checkedChoose > 0) {
      localStorage.removeItem('selectedProducts');
      localStorage.setItem('selectedProducts', selectedProducts.join(','));
      this.router.navigateByUrl('/checkout');
    } else {
      this.toastr.warning('Bạn phải chọn ít nhất một sản phẩm');
    }
  }
}
