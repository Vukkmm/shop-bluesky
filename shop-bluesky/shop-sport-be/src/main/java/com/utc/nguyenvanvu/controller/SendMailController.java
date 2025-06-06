
package com.utc.nguyenvanvu.controller;

import com.utc.nguyenvanvu.repository.UserRepository;
import com.utc.nguyenvanvu.service.SendMailService;
import com.utc.nguyenvanvu.utils.SendMailUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("api/send-mail")
public class SendMailController {

	@Autowired
	SendMailService sendMail;
	@Autowired
	SendMailUtil senMail;

	@Autowired
	UserRepository Urepo;
	// Xác nhận tài khoản email gửi mã OPT về email khách hàng
	@PostMapping("/otp")
	public ResponseEntity<Integer> sendOpt(@RequestBody String email) {
		int random_otp = (int) Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
		if (Urepo.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		sendMailOtp(email, random_otp, "Xác nhận tài khoản!");
		return ResponseEntity.ok(random_otp);
	}

	// sendmail lấy mã OTP
	public void sendMailOtp(String email, int Otp, String title) {
		log.info("email: {}, OTP: {}, title: {}", email, Otp, title);
		String body = "<div>\r\n" + "        <h3>Hãy sử dụng mã sau để xác thực tài khoản. Hãy bảo mật thông tin này!\n" +
									"Mã xác thực (OTP): <span style=\"color:red; font-weight: bold;\">"
				+ Otp + "</span></h3>\r\n" + "    </div>";
		sendMail.queue(email, title, body);
	}


}