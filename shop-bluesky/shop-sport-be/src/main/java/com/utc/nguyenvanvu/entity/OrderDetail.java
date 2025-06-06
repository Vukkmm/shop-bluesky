
package com.utc.nguyenvanvu.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orderDetails")
public class OrderDetail implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderDetailId;
  private int quantity;
  private Double price;
  private String size;

  public void setOrderDetailId(Long orderDetailId) {
    this.orderDetailId = orderDetailId;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public Long getOrderDetailId() {
    return orderDetailId;
  }

  public int getQuantity() {
    return quantity;
  }

  public Double getPrice() {
    return price;
  }

  public Product getProduct() {
    return product;
  }

  public Order getOrder() {
    return order;
  }

  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  @ManyToOne
  @JoinColumn(name = "productId")
  private Product product;

  @ManyToOne
  @JoinColumn(name = "orderId")
  private Order order;

}
