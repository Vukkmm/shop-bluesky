import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { Customer } from '../../common/Customer';
import { Favorites } from '../../common/Favorites';
import { Product } from '../../common/Product';
import { Rate } from '../../common/Rate';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProductService } from '../../services/product.service';
import { RateService } from '../../services/rate.service';
import { SessionService } from '../../services/session.service';
// import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  productSeller: Product[] = [];
  productLatest: Product[] = [];
  productRated: Product[] = [];

  isLoading = true;
  size = 'S';

  customer!: Customer;
  favorite!: Favorites;
  favorites: Favorites[] = [];

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails: CartDetail[] = [];

  product!: Product;
  products!: Product[];
  page: number = 1;
  keyF: string = 'enteredDate';
  key: string = 'enteredDate';
  reverse: boolean = true;

  rates: Rate[] = [];
  countRate!: number;

  slideConfig = { slidesToShow: 7, slidesToScroll: 2, autoplay: true };

  slides = [
    { img: 'banner1.jpg' },
    { img: 'banner2.jpg' },
    { img: 'banner3.jpg' },
    { img: 'banner4.jpg' },
    { img: 'banner.jpg' },
  ];
  slideConfig2 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '60px',
    dots: false,
    infinite: true,
    autoplay: true,
    arrows: false,
    //  "adaptiveHeight": true,
    autoplaySpeed: 2000,
  };
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private customerService: CustomerService,
    private rateService: RateService,
    private toastr: ToastrService,
    private favoriteService: FavoritesService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.getAllProductBestSeller();
    this.getAllProductLatest();
    this.getAllProductRated();
    this.getAllRate();
    this.getProducts();
  }

  getAllRate() {
    this.rateService.getAll().subscribe((data) => {
      this.rates = data as Rate[];
    });
  }

  getAvgRate(id: number): number {
    let avgRating: number = 0;
    this.countRate = 0;
    for (const item of this.rates) {
      if (item.product.productId === id) {
        avgRating += item.rating;
        this.countRate++;
      }
    }
    return Math.round((avgRating / this.countRate) * 10) / 10;
  }

  getAllProductBestSeller() {
    this.productService.getBestSeller().subscribe(
      (data) => {
        this.productSeller = data as Product[];
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Lỗi server!', 'Hệ thống');
        console.log(error);
      }
    );
  }

  getAllProductLatest() {
    this.productService.getLasted().subscribe(
      (data) => {
        this.productLatest = data as Product[];
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Lỗi server!', 'Hệ thống');
        console.log(error);
      }
    );
  }

  getAllProductRated() {
    this.productService.getRated().subscribe(
      (data) => {
        this.productRated = data as Product[];
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Lỗi server!', 'Hệ thống');
        console.log(error);
      }
    );
  }

  toggleLike(id: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info(
        'Hãy đăng nhập để sử dụng dịch vụ của chúng tôi',
        'Hệ thống'
      );
      return;
    }
    this.favoriteService.getByProductIdAndEmail(id, email).subscribe((data) => {
      if (data == null) {
        this.customerService.getByEmail(email).subscribe((data) => {
          this.customer = data as Customer;
          this.favoriteService
            .post(
              new Favorites(
                0,
                new Customer(this.customer.userId),
                new Product(id)
              )
            )
            .subscribe(
              (data) => {
                this.toastr.success(
                  'Thêm sản phẩm yêu thích thành công!',
                  'Hệ thống'
                );
                this.favoriteService.getByEmail(email).subscribe(
                  (data) => {
                    this.favorites = data as Favorites[];
                    this.favoriteService.setLength(this.favorites.length);
                  },
                  (error) => {
                    this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
                  }
                );
              },
              (error) => {
                this.toastr.error('Thêm thất bại!', 'Hệ thống');
              }
            );
        });
      } else {
        this.favorite = data as Favorites;
        this.favoriteService.delete(this.favorite.favoriteId).subscribe(
          (data) => {
            this.toastr.info('Đã xoá ra khỏi danh sách yêu thích!', 'Hệ thống');
            this.favoriteService.getByEmail(email).subscribe(
              (data) => {
                this.favorites = data as Favorites[];
                this.favoriteService.setLength(this.favorites.length);
              },
              (error) => {
                this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
              }
            );
          },
          (error) => {
            this.toastr.error('Lỗi!', 'Hệ thống');
          }
        );
      }
    });
  }

  addCart(productId: number, price: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info(
        'Hãy đăng nhập để sử dụng dịch vụ của chúng tôi',
        'Hệ thống'
      );
      return;
    }
    this.cartService.getCart(email).subscribe((data) => {
      this.cart = data as Cart;
      this.cartDetail = new CartDetail(
        0,
        1,
        price,
        new Product(productId),
        new Cart(this.cart.cartId),
        this.size
      );
      this.cartService.postDetail(this.cartDetail).subscribe(
        (data) => {
          this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
          this.cartService
            .getAllDetail(this.cart.cartId, '')
            .subscribe((data) => {
              this.cartDetails = data as CartDetail[];
              this.cartService.setLength(this.cartDetails.length);
            });
        },
        (error) => {
          this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
          this.router.navigate(['/home']);
          window.location.href = '/';
        }
      );
    });
  }
  sort(keyF: string) {
    if (keyF === 'enteredDate') {
      this.key = 'enteredDate';
      this.reverse = true;
    } else if (keyF === 'priceDesc') {
      this.key = '';
      this.products.sort(
        (a, b) =>
          b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100)
      );
    } else if (keyF === 'priceAsc') {
      this.key = '';
      this.products.sort(
        (a, b) =>
          a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100)
      );
    } else {
      this.key = '';
      this.getProducts();
    }
  }

  getProducts() {
    this.productService.getAll().subscribe(
      (data) => {
        this.isLoading = false;
        this.products = data as Product[];
      },
      (error) => {
        this.toastr.error('Nhãn hàng không tồn tại!', 'Hệ thống');
        this.router.navigate(['/home']);
      }
    );
  }
  // public getImageByProduct(imageBase64: string): any {
  //   if (imageBase64 != null && imageBase64 != undefined && imageBase64 != '') {
  //     const img = new Image();
  //     img.src = `data:image/jpeg;base64,${imageBase64}`;
  //     return img.src;
  //   }
  //   return null;
  // }
}
