package com.memegle.server.config;

import com.memegle.server.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class MyUserPrincipal implements UserDetails {

    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> grantedAuthorities;

    public static MyUserPrincipal toCustomUserDetails(User user) {
        MyUserPrincipal myUserPrincipal = new MyUserPrincipal();
        myUserPrincipal.username = user.getUserName();
        myUserPrincipal.password = user.getPassword();
        myUserPrincipal.grantedAuthorities = Collections.singletonList(new SimpleGrantedAuthority(user.getUserName()));
        return myUserPrincipal;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return grantedAuthorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
