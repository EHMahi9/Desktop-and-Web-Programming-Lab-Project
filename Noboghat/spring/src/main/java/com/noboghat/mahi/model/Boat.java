package com.noboghat.mahi.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "boats")
public class Boat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boatId;

    private String name;
    private Double capacity; // কার্গো ধারণক্ষমতা (কেজি)
    
    // পরবর্তীতে আমরা মালিকের (User) সাথে রিলেশন করব
}