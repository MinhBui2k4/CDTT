package com.example.buivanminh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
// @ComponentScan(basePackages = { "com.example.buivanminh",
// "com.example.buivanminh.config" })
@SpringBootApplication(scanBasePackages = "com.example.buivanminh.security")
public class BuivanminhApplication {
	public static void main(String[] args) {
		SpringApplication.run(BuivanminhApplication.class, args);
	}
}
// @Bean
// public ModelMapper modelMapper() {
// return new ModelMapper();
// }
