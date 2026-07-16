package com.noboghat.mahi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.noboghat.mahi.model.Boat;
import com.noboghat.mahi.repository.BoatRepository;

@RestController
@RequestMapping("/api/boats")
@CrossOrigin(origins = "*")
public class BoatController {

    @Autowired
    private BoatRepository boatRepository;

    // নতুন নৌকা যোগ করার API
    @PostMapping
    public Boat addBoat(@RequestBody Boat boat) {
        return boatRepository.save(boat);
    }

    // সব নৌকার লিস্ট দেখার API
    @GetMapping
    public List<Boat> getAllBoats() {
        return boatRepository.findAll();
    }
}