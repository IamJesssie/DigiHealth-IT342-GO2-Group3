package com.digihealth.backend.security;

import com.digihealth.backend.entity.User;
import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.authority.AuthorityUtils;

import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.authentication.DisabledException("User account is deactivated.");
        }

        String roleName = user.getRole() != null ? user.getRole().name() : "PATIENT";
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                AuthorityUtils.createAuthorityList("ROLE_" + roleName)
        );
    }

    /**
     * Resolve a user by UUID (used with JWT subject = userId).
     */
    @Transactional
    public UserDetails loadUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("User not found with id : " + id)
        );

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.authentication.DisabledException("User account is deactivated.");
        }

        String roleName = user.getRole() != null ? user.getRole().name() : "PATIENT";
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                AuthorityUtils.createAuthorityList("ROLE_" + roleName)
        );
    }
}
