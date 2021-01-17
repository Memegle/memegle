package com.memegle.server.controller;


import com.memegle.server.dto.AuthRequest;
import com.memegle.server.dto.AuthResponse;
import com.memegle.server.model.User;
import com.memegle.server.service.MyUserDetailsService;
import com.memegle.server.util.JwtUtil;
import com.memegle.server.util.MailClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@CrossOrigin
@Controller
public class UserController {

    private MyUserDetailsService userDetailsService;
    private JwtUtil jwtUtil;
    private MailClient mailClient;

    @Value("${memegle.path.domain}")
    private String domain;

    @Autowired
    public void setUserDetailsService(MyUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Autowired
    public void setMailClient(MailClient mailClient) {
        this.mailClient = mailClient;
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
        user.setStatus(0);
        user.setActivationCode(MailClient.generateUUID());
        User byUserName = userDetailsService.findByUserName(email);
        User byEmail = userDetailsService.findByEmail(email);

        if (byEmail != null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "邮箱已注册!");
        }

        if (byUserName != null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "用户名已存在，请更换用户名");
        }

        try {
            String content="<html>\n"+"<body>\n"
                    + "<h3>hello, "+username+",</h3>\n"
                    + "<a href=\""+domain+"\">请点击此处激活你的账号!</a>"
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
        User user = userDetailsService.findByUserNameAndPassword(authRequest.getUsername(), authRequest.getPassword());
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
}
