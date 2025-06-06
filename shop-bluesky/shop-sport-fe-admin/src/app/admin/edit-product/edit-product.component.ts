import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadService } from 'src/app/services/upload.service';
import { ImageDTO } from '../../common/ImageDTO';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  [x: string]: any;

  product!: Product;
  postForm: FormGroup;
  categories!: Category[];
  imageDTO!: ImageDTO;
  imageDTOs!: ImageDTO[];

  imageDTO1!: ImageDTO;
  imageDTO2!: ImageDTO;
  imageDTO3!: ImageDTO;
  imageDTO4!: ImageDTO;
  imageDTO5!: ImageDTO;

  url: string =
    'https://res.cloudinary.com/veggie-shop/image/upload/v1633434089/products/jq4drid7ttqsxwd15xn9.jpg';

  selectFile!: File;
  selectFile1!: File;
  selectFile2!: File;
  selectFile3!: File;
  selectFile4!: File;
  selectFile5!: File;

  image1: string = this.url;
  image2: string = this.url;
  image3: string = this.url;
  image4: string = this.url;
  image5: string = this.url;
  image: string = this.url;

  @Input() id!: number;
  @Input() idIamge1!: number;
  @Input() idIamge2!: number;
  @Input() idIamge3!: number;
  @Input() idIamge4!: number;
  @Input() idIamge5!: number;

  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private imageService: ImageService,
    private router: Router
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
      // 'file': new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProduct();
    this.getImages();
  }

  update() {
    if (this.postForm.valid) {
      this.product = this.postForm.value;
      this.product.category = new Category(this.postForm.value.categoryId, '');
      this.product.image = this.image;
      this.productService.update(this.product, this.id).subscribe((data) => {
        this.imageDTO = new ImageDTO(this.idIamge1, this.product, this.image1);
        this.imageService
          .updateImage(this.idIamge1, this.imageDTO)
          .subscribe((data) => {
            this.imageDTO = data as ImageDTO;
          });
        this.imageDTO = new ImageDTO(this.idIamge2, this.product, this.image2);
        this.imageService
          .updateImage(this.idIamge2, this.imageDTO)
          .subscribe((data) => {
            this.imageDTO = data as ImageDTO;
          });
        this.imageDTO = new ImageDTO(this.idIamge3, this.product, this.image3);
        this.imageService
          .updateImage(this.idIamge3, this.imageDTO)
          .subscribe((data) => {
            this.imageDTO = data as ImageDTO;
          });
        this.imageDTO = new ImageDTO(this.idIamge4, this.product, this.image4);
        this.imageService
          .updateImage(this.idIamge4, this.imageDTO)
          .subscribe((data) => {
            this.imageDTO = data as ImageDTO;
          });
        this.imageDTO = new ImageDTO(this.idIamge5, this.product, this.image5);
        this.imageService
          .updateImage(this.idIamge5, this.imageDTO)
          .subscribe((data) => {
            this.imageDTO = data as ImageDTO;
          });
        this.toastr.success('Cập nhật sản phẩm thành công !');
        // this.saveFinish.emit('done');
        const currentUrl = this.router.url;
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      });
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
    }
    this.modalService.dismissAll();
  }

  getProduct() {
    this.productService.getOne(this.id).subscribe(
      (data) => {
        this.product = data as Product;
        this.postForm = new FormGroup({
          productId: new FormControl(this.product.productId),
          name: new FormControl(this.product.name, [
            Validators.minLength(4),
            Validators.required,
          ]),
          branch: new FormControl(this.product.branch, [
            Validators.minLength(4),
            Validators.required,
          ]),
          material: new FormControl(this.product.material, [
            Validators.minLength(4),
            Validators.required,
          ]),
          quantity: new FormControl(this.product.quantity, [
            Validators.min(0),
            Validators.maxLength(9),
            Validators.required,
          ]),
          price: new FormControl(this.product.price, [
            Validators.required,
            Validators.min(1000),
          ]),
          discount: new FormControl(this.product.discount, [
            Validators.required,
            Validators.min(0),
            Validators.max(100),
            Validators.max(100),
          ]),
          description: new FormControl(
            this.product.description,
            Validators.required
          ),
          enteredDate: new FormControl(this.product.enteredDate),
          categoryId: new FormControl(this.product.category.categoryId),
          status: new FormControl(1),
          sold: new FormControl(this.product.sold),
          size: new FormControl(this.product.size),
          // 'imageBase64': new FormControl(this.product.imageBase64),
          // 'file':new FormControl(this.imageDTO.file),
        });
        // this.urlProduct = this.getImageByProduct(this.product.imageBase64);
        this.image = this.product.image;

        this.imageService.getByProduct(this.id).subscribe(
          (data) => {
            this.imageDTOs = data as ImageDTO[];
            this.idIamge1 = this.imageDTOs[0].imageId;
            this.idIamge2 = this.imageDTOs[1].imageId;
            this.idIamge3 = this.imageDTOs[2].imageId;
            this.idIamge4 = this.imageDTOs[3].imageId;
            this.idIamge5 = this.imageDTOs[4].imageId;
            this.image1 = this.imageDTOs[0].file;
            this.image2 = this.imageDTOs[1].file;
            this.image3 = this.imageDTOs[2].file;
            this.image4 = this.imageDTOs[3].file;
            this.image5 = this.imageDTOs[4].file;
          },
          (error) => {
            this.toastr.error('Lỗi truy xuất dữ liệu abc, bấm f5!', 'Hệ thống');
          }
        );
      },
      (error) => {
        this.toastr.error('Lỗi truy xuất dữ liệu! ', 'Hệ thống');
      }
    );
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
  getImages() {
    this.imageService.getByProduct(this.id).subscribe(
      (data) => {
        this.imageDTOs = data as ImageDTO[];
      },
      (error) => {
        this.toastr.error('Lỗi truy xuất dữ liệu abc, bấm f5!', 'Hệ thống');
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
