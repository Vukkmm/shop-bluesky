import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { Customer } from 'src/app/common/Customer';
import { Order } from 'src/app/common/Order';
import { Statistical } from 'src/app/common/Statistical';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { PageService } from 'src/app/services/page.service';
import { StatisticalService } from 'src/app/services/statistical.service';
@Component({
  selector: 'app-static-order',
  templateUrl: './static-order.component.html',
  styleUrls: ['./static-order.component.css']
})



export class StaticOrderComponent implements OnInit {

  orderHandle1!: number;
  orderHandle2!: number;
  orderHandle3!: number;
  orderHandle4!: number;
  customerLength!: number;
  orders!: Order[];
  customers!: Customer[];

  statistical!: Statistical[];
  labels: string[] = [];
  data: number[] = [];
  year: number = 2021;
  myChartBar !: Chart;
  countYears!: number[];

  revenueYearNow!: number;
  revenueMonthNow!: number;
  
  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  constructor(private pageService: PageService, private toastr: ToastrService, private orderService: OrderService, private customerService: CustomerService, private statisticalService: StatisticalService) { }

  ngOnInit(): void {
 

    // this.getAllOrder();
    this.getStatisticalYear();
    this.getCountYear();
    Chart.register(...registerables);
  }

  getStatisticalYear() {
    this.statisticalService.getByMothOfYear(this.year).subscribe(data => {
      this.statistical = data as Statistical[];
      this.statistical.forEach(item => {
        // this.labels.push('Tháng ' + item.month);
        this.orderService.get().subscribe(data => {
          this.orders = data as Order[];
          this.orderHandle1 = 0;
          this.orderHandle2 = 0;
          this.orderHandle3 = 0;
          this.orderHandle1 = 0;
          for (let i = 0; i < this.orders.length; i++) {
            if (this.orders[i].status == 0) {
              this.orderHandle1++;
            }
            if (this.orders[i].status == 1) {
              this.orderHandle2++;
            }
            if (this.orders[i].status == 2) {
              this.orderHandle3++;
            }
            if (this.orders[i].status == 3) {
              this.orderHandle4++;
            }
          }})
          this.data.push(this.orderHandle1);
          this.data.push(this.orderHandle2);
          this.data.push(this.orderHandle3);
          this.data.push(this.orderHandle4);
        // this.data.push(item.amount);
      })
      this.loadChartBar();
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getCountYear() {
    this.statisticalService.getCountYear().subscribe(data => {
      this.countYears = data as number[];
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getRevenueYear(year: number): number {
    let revenue = 0
    for (let i = 0; i < this.orders.length; i++) {
      if (new Date(this.orders[i].orderDate).getFullYear() == year && this.orders[i].status == 2) {
        revenue += this.orders[i].amount;
      }
    }
    return revenue;
  }

  getRevenueYearNow(): number {
    let revenue = 0
    for (let i = 0; i < this.orders.length; i++) {
      if (new Date(this.orders[i].orderDate).getFullYear() == new Date().getFullYear() && this.orders[i].status == 2) {
        revenue += this.orders[i].amount;
      }
    }
    return revenue;
  }

  getRevenueMonthNow(): number {
    let revenue = 0
    for (let i = 0; i < this.orders.length; i++) {
      if (new Date(this.orders[i].orderDate).getMonth() == new Date().getMonth() && new Date(this.orders[i].orderDate).getFullYear() == new Date().getFullYear() && this.orders[i].status == 2) {
        revenue += this.orders[i].amount;
      }
    }
    return revenue;
  }

  // getAllOrder() {
  //   this.orderService.get().subscribe(data => {
  //     this.orders = data as Order[];
  //     this.orderHandle = 0;
  //     for (let i = 0; i < this.orders.length; i++) {
  //       if (this.orders[i].status == 0) {
  //         this.orderHandle++;
  //       }
  //     }
  //   }, error => {
  //     this.toastr.error('Lỗi server', 'Hệ thống');
  //   })
  // }


  setYear(year: number) {
    this.year = year;
    this.labels = [];
    this.data = [];
    this.myChartBar.destroy();
    this.ngOnInit();
    
  }


  loadChartBar() {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: ['Tháng 1', 'Tháng 2','Tháng 3','Tháng 4','Tháng 5', 'Tháng 6','Tháng 7','Tháng 8','Tháng 9', 'Tháng 10','Tháng 11', 'Tháng 12'],
        datasets: [
          {
            label: 'Chờ xác nhận',
            data: this.data,
            backgroundColor: 'rgba(0, 0, 255,0.7)',
            borderWidth: 1
          },
          {
            label: 'Đang giao hàng',
            data: this.data,
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            borderWidth: 1
          },
          {
            label: 'Đơn hàng thành công',
            data: this.data,
            backgroundColor: 'rgba(0, 255, 0,0.7)',
            borderWidth: 1
          },
          {
            label: 'Đã hủy',
            data:  this.data,
            backgroundColor: 'rgba(255, 0, 0,0.7)',
            borderWidth: 1
          }
        ]     
      },
      
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    const options = {
      indexAxis: 'y',
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }



}
