package com.memegle.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String greet() {
        return "Hey Memegle!\n歡迎來到Memegle！";
    }

}
