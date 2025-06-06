import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { District } from 'src/app/common/District';
import { Notification } from 'src/app/common/Notification';
import { Order } from 'src/app/common/Order';
import { Province } from 'src/app/common/Province';
import { Ward } from 'src/app/common/Ward';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  discount!: number;
  amount!: number;
  amountReal!: number;
  ship: number = 30000;
  sale!: number;

  postForm: FormGroup;

  provinces: any;
  districts: any;
  wards: any;

  province!: Province;
  district!: District;
  ward!: Ward;

  amountPaypal!: number;
  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;
  public payPalConfig?: IPayPalConfig;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private orderService: OrderService,
    private location: ProvinceService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {
    this.postForm = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern('(0)[0-9]{9}'),
      ]),
      province: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      ward: new FormControl('', [Validators.required]),
      number: new FormControl(''),
      note: new FormControl(''),
    });
    this.getProvinces();
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.discount = 0;
    this.amount = 0;
    this.amountPaypal = 0;
    this.amountReal = 0;
    this.getAllItem();
  }

  getAllItem() {
    let email = this.sessionService.getUser();
    var itemSelected = localStorage.getItem('selectedProducts') ?? '';
    this.cartService.getCart(email).subscribe((data) => {
      this.cart = data as Cart;
      this.postForm.setValue({
        phone: this.cart.phone,
        province: '',
        district: '',
        ward: '',
        number: '',
        note: '',
      });
      this.cartService
        .getAllDetail(this.cart.cartId, itemSelected)
        .subscribe((data) => {
          this.cartDetails = data as CartDetail[];
          this.cartService.setLength(this.cartDetails.length);
          if (this.cartDetails.length == 0) {
            this.router.navigate(['/']);
            this.toastr.info(
              'Hãy chọn một vài sản phẩm rồi tiến hành thanh toán',
              'Hệ thống'
            );
          }
          this.cartDetails.forEach((item) => {
            // tổng tiền gốc
            this.amountReal += item.product.price * item.quantity;
            // tổng tiền phải thanh toán
            this.amount += item.price * item.quantity;
          });
          this.discount = this.amount - this.amountReal;

          this.amountPaypal = this.amount / 22727.5;
        });
    });
  }

  checkOut() {
    if (this.postForm.valid) {
      Swal.fire({
        title: 'Bạn có muốn đặt đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Không',
        confirmButtonText: 'Đặt',
      }).then((result) => {
        if (result.isConfirmed) {
          let email = this.sessionService.getUser();
          this.cartService.getCart(email).subscribe(
            (data) => {
              this.cart = data as Cart;
              // this.cart.address = this.postForm.value.number + ', ' + this.ward.name + ', ' + this.district.name + ', ' + this.province.name + ' ('+this.postForm.value.note+')' ;
              this.cart.address =
                this.postForm.value.number +
                ', ' +
                this.postForm.value.ward +
                ', ' +
                this.postForm.value.district +
                ', ' +
                this.postForm.value.province +
                ' (' +
                this.postForm.value.note +
                ')';
              this.cart.phone = this.postForm.value.phone;
              this.cartService.updateCart(email, this.cart).subscribe(
                (data) => {
                  this.cart = data as Cart;
                  this.orderService.post(email, this.cart).subscribe(
                    (data) => {
                      let order: Order = data as Order;
                      this.sendMessage(order.ordersId);
                      this.router.navigate(['/cart']);
                      Swal.fire({
                        title: 'Chúc mừng bạn đã đặt hàng thành công!',
                        icon: 'success',
                        confirmButtonColor: '#007bff',
                        confirmButtonText: 'Xem đơn hàng',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.router.navigate(['/bill']);
                        }
                      });
                    },
                    (error) => {
                      this.toastr.error('Lỗi server email', 'Hệ thống');
                    }
                  );
                },
                (error) => {
                  this.toastr.error('Lỗi server', 'Hệ thống');
                }
              );
            },
            (error) => {
              this.toastr.error('Lỗi server', 'Hệ thống');
            }
          );
        }
      });
    } else {
      this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
    }
  }
  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.selectedItems.forEach((item) => {
      totalPrice += item.price;
    });
    return totalPrice;
  }

  sendMessage(id: number) {
    let chatMessage = new ChatMessage(
      this.cart.user.name,
      ' đã đặt một đơn hàng'
    );
    this.notificationService
      .post(
        new Notification(
          0,
          this.cart.user.name + ' đã đặt một đơn hàng (' + id + ')'
        )
      )
      .subscribe((data) => {
        this.webSocketService.sendMessage(chatMessage);
      });
  }
  selectedItems: CartDetail[] = [];

  updateTotal() {
    this.selectedItems = this.cartDetails.filter((item) => item.checked);
    this.calculateTotalPrice(); // Sau khi cập nhật danh sách sản phẩm được chọn, tính lại tổng giá trị
  }
  calculateAmount() {
    this.amount = 0;
    let itemCount = 0;
    this.cartDetails.forEach((item) => {
      let itemTotal = item.price * item.quantity;
      this.amount += itemTotal;
      if (itemTotal % 5 === 0) {
        itemCount++;
      }
    });
    this.amount += itemCount;
    this.amount += this.discount;
  }

  getProvinces() {
    this.location.getAllProvinces().subscribe((data) => {
      this.provinces = data.data.content;
    });
  }

  getDistricts(province_code: string) {
    this.location.getDistricts(province_code).subscribe((data) => {
      this.districts = data.data.content;
    });
  }

  getWards(code: string) {
    this.location.getWards(code).subscribe((data) => {
      this.wards = data.data.content;
    });
  }

  getWard() {
    this.location.getWard(this.wardCode).subscribe((data) => {
      this.ward = data as Ward;
    });
  }

  setProvinceCode(code: any) {
    this.getDistricts(code.value);
  }

  setDistrictCode(code: any) {
    this.getWards(code.value);
  }

  setWardCode(code: any) {
    this.wardCode = code.value;
    this.getWard();
  }
}
