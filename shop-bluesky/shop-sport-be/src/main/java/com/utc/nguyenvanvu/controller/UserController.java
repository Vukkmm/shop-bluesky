
package com.utc.nguyenvanvu.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.utc.nguyenvanvu.config.JwtUtils;
import com.utc.nguyenvanvu.dto.JwtResponse;
import com.utc.nguyenvanvu.dto.LoginRequest;
import com.utc.nguyenvanvu.dto.MessageResponse;
import com.utc.nguyenvanvu.dto.SignupRequest;
import com.utc.nguyenvanvu.entity.AppRole;
import com.utc.nguyenvanvu.entity.Cart;
import com.utc.nguyenvanvu.entity.User;
import com.utc.nguyenvanvu.repository.AppRoleRepository;
import com.utc.nguyenvanvu.repository.CartRepository;
import com.utc.nguyenvanvu.repository.UserRepository;
import com.utc.nguyenvanvu.service.SendMailService;
import com.utc.nguyenvanvu.service.implement.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("api/auth")
public class UserController {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	CartRepository cartRepository;

	@Autowired
	AppRoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	JwtUtils jwtUtils;

	@Autowired
	SendMailService sendMailService;
	//lấy tất cả danh sách khách hàng
	@GetMapping
	public ResponseEntity<List<User>> getAll() {
		return ResponseEntity.ok(userRepository.findByStatusTrue());
	}
	// lấy thông tin khách hàng theo id
	@GetMapping("{id}")
	public ResponseEntity<User> getOne(@PathVariable("id") Long id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(userRepository.findById(id).get());
	}
	// Lấy thông tin khách hàng theo email
	@GetMapping("email/{email}")
	public ResponseEntity<User> getOneByEmail(@PathVariable("email") String email) {
		if (userRepository.existsByEmail(email)) {
			return ResponseEntity.ok(userRepository.findByEmail(email).get());
		}
		return ResponseEntity.notFound().build();
	}
	//Thêm khách hàng
	@PostMapping
	public ResponseEntity<User> post(@RequestBody User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			return ResponseEntity.notFound().build();
		}
		if (userRepository.existsById(user.getUserId())) {
			return ResponseEntity.badRequest().build();
		}

		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(1, null));

		user.setRoles(roles);

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setToken(jwtUtils.doGenerateToken(user.getEmail()));
		User u = userRepository.save(user);
		Cart c = new Cart(0L, u.getAddress(), u.getPhone(), u);
		cartRepository.save(c);
		return ResponseEntity.ok(u);
	}
	// Thêm nhân viên
	@PostMapping("/post")
	public ResponseEntity<User> postEmployee(@RequestBody User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			return ResponseEntity.notFound().build();
		}
		if (userRepository.existsById(user.getUserId())) {
			return ResponseEntity.badRequest().build();
		}

		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(2, null));

		user.setRoles(roles);

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setToken(jwtUtils.doGenerateToken(user.getEmail()));
		User u = userRepository.save(user);
		Cart c = new Cart(0L, u.getAddress(), u.getPhone(), u);
		cartRepository.save(c);
		return ResponseEntity.ok(u);
	}
	// cập nhật thông tin tài khoản
	@PutMapping("{id}")
	public ResponseEntity<User> put(@PathVariable("id") Long id, @RequestBody User user) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		if (!id.equals(user.getUserId())) {
			return ResponseEntity.badRequest().build();
		}

		User temp = userRepository.findById(id).get();

		if (!user.getPassword().equals(temp.getPassword())) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		}

		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(1, null));

		user.setRoles(roles);
		return ResponseEntity.ok(userRepository.save(user));
	}

	@PutMapping("admin/{id}")
	public ResponseEntity<User> putAdmin(@PathVariable("id") Long id, @RequestBody User user) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		if (!id.equals(user.getUserId())) {
			return ResponseEntity.badRequest().build();
		}
		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(2, null));

		user.setRoles(roles);
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		return ResponseEntity.ok(userRepository.save(user));
	}

	@DeleteMapping("{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		User u = userRepository.findById(id).get();
		u.setStatus(false);
		userRepository.save(u);
		return ResponseEntity.ok().build();
	}
	//Đăng nhập
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Validated @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getName(),
				userDetails.getEmail(), userDetails.getPassword(), userDetails.getPhone(), userDetails.getAddress(),
				userDetails.getGender(), userDetails.getStatus(), userDetails.getImage(), userDetails.getRegisterDate(),
				roles));

	}
	//Đăng kí
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Validated @RequestBody SignupRequest signupRequest) {

		if (userRepository.existsByEmail(signupRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
		}

		if (userRepository.existsByEmail(signupRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is alreadv in use!"));
		}

		// create new user account
		User user = new User(signupRequest.getName(), signupRequest.getEmail(),
				passwordEncoder.encode(signupRequest.getPassword()), signupRequest.getPhone(),
				signupRequest.getAddress(), signupRequest.getGender(), signupRequest.getStatus(),
				signupRequest.getImage(), signupRequest.getRegisterDate(),
				jwtUtils.doGenerateToken(signupRequest.getEmail()));
		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(1, null));

		user.setRoles(roles);
		userRepository.save(user);
		Cart c = new Cart(0L, user.getAddress(), user.getPhone(), user);
		cartRepository.save(c);
		return ResponseEntity.ok(new MessageResponse("Đăng kí thành công"));

	}
	//Đăng xuất
	@GetMapping("/logout")
	public ResponseEntity<Void> logout() {
		return ResponseEntity.ok().build();
	}
	//Quên mật khẩu
	@PostMapping("send-mail-forgot-password-token")
	public ResponseEntity<String> sendToken(@RequestBody String email) {

		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		User user = userRepository.findByEmail(email).get();
		String token = user.getToken();
		sendMaiToken(email, token, "Reset mật khẩu");
		return ResponseEntity.ok().build();

	}

	public void sendMaiToken(String email, String token, String title) {
		String body = "\r\n" + "    <h2>Hãy nhấp vào link để thay đổi mật khẩu của bạn</h2>\r\n"
				+ "    <a href=\"http://localhost:8080/forgot-password/" + token + "\">Đổi mật khẩu</a>";
		sendMailService.queue(email, title, body);
	}

}
