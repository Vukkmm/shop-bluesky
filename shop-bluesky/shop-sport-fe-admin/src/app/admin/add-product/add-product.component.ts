import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImageDTO } from 'src/app/common/ImageDTO';
import { Category } from '../../common/Category';
import { Product } from '../../common/Product';
import { CategoryService } from '../../services/category.service';
import { ImageService } from '../../services/image.service';
import { ProductService } from '../../services/product.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  [x: string]: any;

  product!: Product;
  imageDTO!: ImageDTO;
  id!: number;
  postForm: FormGroup;
  categories!: Category[];
  selectFile!: File;
  selectFile1!: File;
  selectFile2!: File;
  selectFile3!: File;
  selectFile4!: File;
  selectFile5!: File;

  url: string =
    'https://img.freepik.com/free-vector/400-error-bad-request-concept-illustration_114360-1933.jpg?w=740&t=st=1712197584~exp=1712198184~hmac=33727b23de600ffe09dbe6fc9f9e9b5f84dcb99778e03013468dc0c1a5466c8e';
  image1: string = this.url;
  image2: string = this.url;
  image3: string = this.url;
  image4: string = this.url;
  image5: string = this.url;
  image: string = this.url;

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private uploadService: UploadService,
    private imageService: ImageService
  ) {
    this.postForm = new FormGroup({
      productId: new FormControl(0),
      name: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      branch: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      material: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      quantity: new FormControl(null, [Validators.min(1), Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(1000)]),
      discount: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      description: new FormControl(null, Validators.required),
      enteredDate: new FormControl(new Date()),
      categoryId: new FormControl(1),
      status: new FormControl(1),
      sold: new FormControl(0),
      size: new FormControl(),
      // 'imageBase64': new FormControl(),
      // 'file': new FormControl()
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  save() {
    if (this.postForm.valid) {
      this.product = this.postForm.value;
      this.product.category = new Category(this.postForm.value.categoryId, '');
      this.product.image = this.image;
      this.productService.save(this.product).subscribe((data) => {
        this.product = data as Product;
        // this.imageDTO = new ImageDTO(0, this.product, this.postForm.value.file);
        this.imageDTO = new ImageDTO(0, this.product, this.image1);
        this.imageService.post(this.imageDTO).subscribe((data) => {});
        this.product = data as Product;
        this.imageDTO = new ImageDTO(0, this.product, this.image2);
        this.imageService.post(this.imageDTO).subscribe((data) => {
          this.imageDTO = data as ImageDTO;
        });
        this.product = data as Product;
        this.imageDTO = new ImageDTO(0, this.product, this.image3);
        this.imageService.post(this.imageDTO).subscribe((data) => {
          this.imageDTO = data as ImageDTO;
        });
        this.product = data as Product;
        this.imageDTO = new ImageDTO(0, this.product, this.image4);
        this.imageService.post(this.imageDTO).subscribe((data) => {
          this.imageDTO = data as ImageDTO;
        });
        this.product = data as Product;
        this.imageDTO = new ImageDTO(0, this.product, this.image5);
        this.imageService.post(this.imageDTO).subscribe((data) => {
          this.imageDTO = data as ImageDTO;
        });
        this.toastr.success('Thêm mới sản phẩm thành công !');
        this.saveFinish.emit('done');
        const currentUrl = this.router.url;
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      });
    } else {
      this.toastr.error('Thêm thất bại!', 'Hệ thống');
    }
    this.postForm = new FormGroup({
      productId: new FormControl(0),
      name: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      branch: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      material: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      quantity: new FormControl(null, [Validators.min(1), Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(1000)]),
      discount: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      description: new FormControl(null, Validators.required),
      enteredDate: new FormControl(new Date()),
      categoryId: new FormControl(1),
      status: new FormControl(1),
      sold: new FormControl(0),
      // 'imageBase64': new FormControl(this.product.imageBase64),
    });
    // this.urlProduct = this.getImageByProduct(this.product.imageBase64);
    this.image = this.url;
    this.modalService.dismissAll();
  }

  getCategories() {
    this.categoryService.getAll().subscribe(
      (data) => {
        this.categories = data as Category[];
      },
      (error) => {
        this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
      }
    );
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // onFileSelectImage(event: any): void {
  //   if (event != null && event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (event) => {
  //       this.urlProduct = event.target?.result;
  //       let base64result: any = event.target?.result?.toString().split(',')[1];
  //       if (base64result != null && base64result != undefined && base64result != '') {
  //         this.postForm.value.imageBase64 = base64result;
  //       }
  //     }
  //   }
  // }
  // public getImageByProduct(imageBase64: string): any {
  //   if (imageBase64 != null && imageBase64 != undefined && imageBase64 != '') {
  //     const img = new Image();
  //     img.src = `data:image/jpeg;base64,${imageBase64}`;
  //     return img.src;
  //   }
  //   return null;
  // }
  //  onFileSelectImages(event: any): void {
  //     if (event != null && event.target.files && event.target.files[0]) {
  //       var reader = new FileReader();
  //       reader.readAsDataURL(event.target.files[0]);
  //       reader.onload = (event) => {
  //         this.urlProduct1 = event.target?.result;
  //         let base64result: any = event.target?.result?.toString().split(',')[1];
  //         if (base64result != null && base64result != undefined && base64result != '') {
  //           this.postForm.value.file = base64result;
  //         }
  //       }
  //     }
  //   }
  //  public getImageByProducts(file: string): any {
  //   if (file != null && file != undefined && file != '') {
  //     const img = new Image();
  //     img.src = `data:image/jpeg;base64,${file}`;
  //     return img.src;
  //   }
  //   return null;
  // }
  onFileSelect1(event: any) {
    this.selectFile = event.target.files[0];
    this.uploadService.uploadProduct(this.selectFile).subscribe((response) => {
      if (response) {
        this.image = response.secure_url;
      }
    });
  }
  onFileSelect(event: any) {
    this.selectFile1 = event.target.files[0];
    this.uploadService.uploadProduct(this.selectFile1).subscribe((response) => {
      if (response) {
        this.image1 = response.secure_url;
      }
    });
    this.selectFile2 = event.target.files[1];
    this.uploadService.uploadProduct(this.selectFile2).subscribe((response) => {
      if (response) {
        this.image2 = response.secure_url;
      }
    });
    this.selectFile3 = event.target.files[2];
    this.uploadService.uploadProduct(this.selectFile3).subscribe((response) => {
      if (response) {
        this.image3 = response.secure_url;
      }
    });
    this.selectFile4 = event.target.files[3];
    this.uploadService.uploadProduct(this.selectFile4).subscribe((response) => {
      if (response) {
        this.image4 = response.secure_url;
      }
    });
    this.selectFile5 = event.target.files[4];
    this.uploadService.uploadProduct(this.selectFile5).subscribe((response) => {
      if (response) {
        this.image5 = response.secure_url;
      }
    });
  }
}
