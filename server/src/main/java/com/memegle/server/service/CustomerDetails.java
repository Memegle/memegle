package com.memegle.server.service;

import com.memegle.server.model.CustomUserDetails;
import com.memegle.server.model.User;
import com.memegle.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerDetails implements UserDetailsService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerDetails (UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User findByUserName(String username) {
        return userRepository.findByUserName(username);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findByEmailAndPassword(String email, String password) {
        User user = findByEmail(email);
        if (user != null) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }


    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUserName(username);
        return CustomUserDetails.toCustomUserDetails(user);
    }
}
