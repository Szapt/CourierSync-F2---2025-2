package com.couriersync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.couriersync.entity.Usuario;
import com.couriersync.repository.UsuarioRepository;
import com.couriersync.service.AuthService;
import com.couriersync.service.SignUpService;
import com.couriersync.service.JwtService;

import jakarta.validation.Valid;

import com.couriersync.dto.UsuarioLoginDTO;
import com.couriersync.dto.UsuarioRegistroDTO;
import java.util.Map;


@RestController
@CrossOrigin(origins = "http://localhost:8080", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH}, allowedHeaders = "*", allowCredentials = "true")
public class AuthController {
    private final AuthService authService;
    private final SignUpService signUpService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthService authService, UsuarioRepository usuarioRepository, SignUpService signUpService, JwtService jwtService) {
        this.authService = authService;
        this.signUpService = signUpService;
        this.jwtService = jwtService;
    }

    @GetMapping("/user")
    public Usuario getMethodName(@RequestParam String cedula) {
        return authService.findByCedula(cedula);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UsuarioLoginDTO usuarioLoginDTO) {
        boolean success = authService.authenticate(usuarioLoginDTO.getUsername(),
            usuarioLoginDTO.getContraseña(),
            usuarioLoginDTO.getRol());
       
        if (!success) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Obtener información del usuario
        Usuario usuario = authService.findByUsuario(usuarioLoginDTO.getUsername());
    
        System.out.println("Usuario: " + usuario);
        // Verificar si el usuario tiene MFA habilitado
        if (usuario.isMfaEnabled()) {
            return ResponseEntity.ok(Map.of(
                "message", "Se requiere verificación MFA",
                "requiresMfa", true,
                "cedula", usuario.getCedula()
            ));
        }

        // Generar JWT token
        String token = jwtService.generateToken(
            usuario.getCedula(),
            usuario.getUsuario(),
            usuario.getRol()
        );

        return ResponseEntity.ok(Map.of(
            "token", token,
            "message", "Login exitoso",
            "cedula", usuario.getCedula(),
            "rol", usuario.getRol()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrarUsuario(@Valid @RequestBody UsuarioRegistroDTO usuarioDTO) {
        signUpService.registrarUsuario(usuarioDTO);
        return ResponseEntity.ok("Usuario creado con éxito");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                               .body("Token de autorización requerido");
        }

        try {
            String token = authHeader.substring(7); // Remover "Bearer "
            
            // Validar el token
            String cedula = jwtService.extractCedula(token);
            if (!jwtService.validateToken(token, cedula)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                   .body("Token inválido");
            }

            // En un sistema más robusto, aquí agregarías el token a una blacklist
            // Por ahora, simplemente confirmamos que el logout fue exitoso
            return ResponseEntity.ok(Map.of(
                "message", "Logout exitoso",
                "cedula", cedula
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                               .body("Token inválido o expirado");
        }
    }
}
