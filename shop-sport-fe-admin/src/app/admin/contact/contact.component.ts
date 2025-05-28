import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Contact } from 'src/app/common/Contact';
import { ContactService } from 'src/app/services/contact.service';
import { PageService } from 'src/app/services/page.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  listData!: MatTableDataSource<Contact>;
  contact!: Contact[];
  contactLength!: number;
  columns: string[] = ['id', 'name','email', 'date', 'title','content','res','delete'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private toastr: ToastrService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('contact');
    this.getAll();
  }

  getAll() {
    this.contactService.getAll().subscribe(data => {
      this.contact = data as Contact[];
      this.listData = new MatTableDataSource(this.contact);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.contactLength = this.contact.length;
    }, error => {
      console.log('loi' + error);
    })
  }

  finish() {
    this.ngOnInit();
  }

  delete(id: number, name: string) {
    Swal.fire({
      title: 'Bạn muốn xoá liên hệ không ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.delete(id).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('Thông báo xoá thành công!', 'Hệ thống');
        }, error => {
          this.toastr.error('Thông báo xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();
  }

}
