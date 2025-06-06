
package com.utc.nguyenvanvu.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.*;

@SuppressWarnings("serial")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ordersId;
	private Date orderDate;
	private Double amount;
	private String address;
	private String phone;
	private int status;
	private Double ship;

	public Long getOrdersId() {
		return ordersId;
	}

	public Date getOrderDate() {
		return orderDate;
	}

	public Double getAmount() {
		return amount;
	}

	public String getAddress() {
		return address;
	}

	public String getPhone() {
		return phone;
	}

	public int getStatus() {
		return status;
	}

	public Double getShip() {
		return ship;
	}

	public void setOrdersId(Long ordersId) {
		this.ordersId = ordersId;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public void setShip(Double ship) {
		this.ship = ship;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public User getUser() {
		return user;
	}

	@ManyToOne
	@JoinColumn(name = "userId")
	private User user;

}
