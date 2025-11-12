package com.digihealth.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            logger.debug("JwtAuthenticationFilter - Request URI: {}", request.getRequestURI());
            logger.debug("JwtAuthenticationFilter - Authorization header: {}", request.getHeader("Authorization"));
            logger.debug("JwtAuthenticationFilter - Extracted JWT: {}", jwt != null ? "Present (length=" + jwt.length() + ")" : "NULL");

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String userId = tokenProvider.getUserIdFromJWT(jwt);

                logger.debug("JwtAuthenticationFilter - Token valid, userId: {}", userId);

                // Subject is the user ID (UUID). Resolve using loadUserById to align with token contents.
                UserDetails userDetails;
                if (userDetailsService instanceof com.digihealth.backend.security.CustomUserDetailsService) {
                    com.digihealth.backend.security.CustomUserDetailsService custom =
                            (com.digihealth.backend.security.CustomUserDetailsService) userDetailsService;
                    userDetails = custom.loadUserById(java.util.UUID.fromString(userId));
                } else {
                    // Fallback to existing behavior if a different impl is wired
                    userDetails = userDetailsService.loadUserByUsername(userId);
                }
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("JwtAuthenticationFilter - Authentication set for user: {}", userDetails.getUsername());
            } else {
                logger.debug("JwtAuthenticationFilter - No valid JWT token found");
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
