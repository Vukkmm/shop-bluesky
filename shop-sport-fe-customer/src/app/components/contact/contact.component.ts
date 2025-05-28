import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Contact } from 'src/app/common/Contact';
import { ContactService } from 'src/app/services/contact.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact!: Contact;
  contactForm!: FormGroup;
  constructor(
    private contactService: ContactService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.contactForm = new FormGroup({
      'id': new FormControl(0),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'title': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'content': new FormControl(null, [Validators.required]),
      'date': new FormControl(new Date),
      'status': new FormControl(0),
      'trash': new FormControl(1),
    })
  }

  ngOnInit(): void {
    // this.send();

  }
  send() {
    if (this.contactForm.valid) {
        this.contact = this.contactForm.value;
        this.contactService.post(this.contact).subscribe(data => {
          this.toastr.success('Gửi thành công!', 'Hệ thống');
        })
    } else {
      this.toastr.error('Giử thất bại. Hãy điền đầy đủ thông tin!', 'Hệ thống');
    }
    this.contactForm = new FormGroup({
      'id': new FormControl(0),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'title': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'content': new FormControl(null, [Validators.required]),
      'date': new FormControl(new Date),
      'status': new FormControl(0),
      'trash': new FormControl(1),
    })
    this.modalService.dismissAll();
  }
}
