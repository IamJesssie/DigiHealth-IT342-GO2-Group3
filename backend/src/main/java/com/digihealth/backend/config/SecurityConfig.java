package com.digihealth.backend.config;

import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.web.filter.CorsFilter;



import java.util.Arrays;



@Configuration

@EnableWebSecurity

public class SecurityConfig {



    @Bean

    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }



    @Bean

    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {

        return authenticationConfiguration.getAuthenticationManager();

    }



    @Bean

    public CorsFilter corsFilter() {

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        config.addAllowedOrigin("http://localhost:3000");

        config.addAllowedHeader("*");

        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);

    }



    @Bean

    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // This configuration provides NO SECURITY and permits all requests.

        http.cors().and().csrf().disable()

            .authorizeRequests()

            .anyRequest().permitAll();

        return http.build();

    }

}
