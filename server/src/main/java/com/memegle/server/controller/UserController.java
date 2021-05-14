package com.memegle.server.controller;


import com.memegle.server.dto.AuthRequest;
import com.memegle.server.dto.AuthResponse;
import com.memegle.server.model.User;
import com.memegle.server.service.CustomerDetails;
import com.memegle.server.util.JwtUtil;
import com.memegle.server.util.MailClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@CrossOrigin
@Controller
public class UserController {

    private final CustomerDetails userDetailsService;
    private final JwtUtil jwtUtil;
    private final MailClient mailClient;
    private final PasswordEncoder passwordEncoder;



    @Value("${memegle.path.domain}")
    private String domain;

    public UserController(CustomerDetails userDetailsService, JwtUtil jwtUtil, MailClient mailClient, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.mailClient = mailClient;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    @ResponseBody
    public String registerUser(@RequestBody @Valid AuthRequest authRequest) {
        String email = authRequest.getEmail();
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();
        if (email.equals("") || username.equals("") || password.equals("")) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "用户信息不能为空！");
        }
        User user = new User();
        user.setEmail(email);
        user.setUserName(username);
        user.setPassword(password);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(0);
        user.setActivationCode(MailClient.generateUUID());
        User byUserName = userDetailsService.findByUserName(username);
        User byEmail = userDetailsService.findByEmail(email);

        if (byEmail != null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "邮箱已注册!");
        }
        if (byUserName != null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "用户名已存在，请更换用户名");
        }
        //  check whether password length have at least 7 character.
        if(password.length()<8 ){
             throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "密码需至少八位");
        }
        // check whether password contains at least one letter
        if(password.matches(".*[a-z].*") ){
             throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "密码需有至少一个字母");
        }
        // check whether password contain any space.
        if(password.contains(" ")){
             throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "密码不能包含空格");
        }

        try {
            String content="<html>\n"+"<body>\n"
                    + "<h3>Hello "+username+",</h3>\n"
                    + "<a href=\""+domain+"/activation"+"/"+username+"/"+user.getActivationCode()+"\">请点击此处激活你的账号!</a>"
                    +"</body>\n"+"</html>";
            mailClient.sendMail(email,"账号激活", content);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "发送邮件失败: " + e.getMessage());
        }

        userDetailsService.saveUser(user);
        return "Register successful";
    }

    @PostMapping("/auth")
    @ResponseBody
    public AuthResponse createAuthentication(@RequestBody AuthRequest authRequest) {
        User user = userDetailsService.findByEmailAndPassword(authRequest.getEmail(), authRequest.getPassword());
        String token;
        if (user != null) {
            token = jwtUtil.generateToken(user.getEmail());
        }else {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "用户不存在！");
        }

        if (user.getStatus() == 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "用户未激活, 请点击邮箱激活链接！");
        }

        return new AuthResponse(token);
    }

    @GetMapping("/activation/{username}/{code}")
    public String activateAccount(Model model, @PathVariable String username, @PathVariable String code) {
        User user = userDetailsService.findByUserName(username);
        if (user.getStatus() == 1) {
            model.addAttribute("msg","账号已激活，请勿重复激活");
        }else if (code.equals(user.getActivationCode())){
            model.addAttribute("msg", "账号激活成功，请登录");
            user.setStatus(1);
            userDetailsService.saveUser(user);
        }else {
           model.addAttribute("msg", "账号激活失败");
        }


        return "/activation/index";
    }

}
