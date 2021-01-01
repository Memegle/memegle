package com.memegle.server.controller;


import com.memegle.server.model.AuthRequest;
import com.memegle.server.model.AuthResponse;
import com.memegle.server.model.User;
import com.memegle.server.service.MyUserDetailsService;
import com.memegle.server.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin
@Controller
public class UserController {

    private MyUserDetailsService userDetailsService;
    private JwtUtil jwtUtil;

    @Autowired
    public void setUserDetailsService(MyUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/register")
    @ResponseBody
    public String registerUser(@RequestBody @Valid AuthRequest authRequest) {
        User user = new User();
        user.setUserName(authRequest.getUsername());
        user.setPassword(authRequest.getPassword());
        userDetailsService.saveUser(user);
        return "OK";
    }

    @PostMapping("/auth")
    @ResponseBody
    public AuthResponse createAuthentication(@RequestBody AuthRequest authRequest) throws Exception {
        User user = userDetailsService.findByUserNameAndPassword(authRequest.getUsername(), authRequest.getPassword());

        if (user != null) {
            String token = jwtUtil.generateToken(user.getUserName());
            return new AuthResponse(token);
        }

        return null;
    }
}
