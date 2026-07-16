package com.noboghat.mahi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // এটি HTML ফাইল থেকে ডাটা আসার অনুমতি দেয়
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // নতুন ইউজার রেজিস্ট্রেশন করার মেথড
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        // ফ্রন্টএন্ড থেকে আসা ডাটা সরাসরি ডাটাবেসে সেভ করে দেবে
        return userRepository.save(user); 
    }
}