package com.couriersync.users.service;

import com.couriersync.users.entity.Rol;
import com.couriersync.users.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RolService {
    
    @Autowired
    private RolRepository rolRepository;
    
    // Caché en memoria para evitar consultas a BD en cada request
    private Map<Integer, String> rolesCache = new HashMap<>();
    
    /**
     * Carga los roles en memoria al iniciar la aplicación
     */
    @PostConstruct
    public void cargarRolesEnCache() {
        List<Rol> roles = rolRepository.findAll();
        for (Rol rol : roles) {
            String nombreRol = normalizarNombreRol(rol.getNombreRol());
            rolesCache.put(rol.getIdRol(), nombreRol);
        }
        System.out.println("✅ Roles cargados en caché: " + rolesCache);
    }
    
    private String normalizarNombreRol(String nombreRol) {
        if (nombreRol == null || nombreRol.isEmpty()) {
            return "ROLE_USER";
        }
        
        // Normalizar: convertir a mayúsculas, eliminar espacios y caracteres especiales
        String rolNormalizado = nombreRol.toUpperCase().trim();
        // Eliminar espacios, guiones y caracteres especiales
        rolNormalizado = rolNormalizado.replaceAll("[\\s\\-_]", "");
        
        // Mapeo de nombres comunes a nombres normalizados
        if (rolNormalizado.contains("ADMIN")) {
            rolNormalizado = "ADMIN";
        } else if (rolNormalizado.contains("GESTOR") && rolNormalizado.contains("RUTA")) {
            rolNormalizado = "GESTORRUTA";
        } else if (rolNormalizado.contains("CONDUCTOR")) {
            rolNormalizado = "CONDUCTOR";
        } else if (rolNormalizado.contains("AUDITOR")) {
            rolNormalizado = "AUDITOR";
        }
        
        if (!rolNormalizado.startsWith("ROLE_")) {
            rolNormalizado = "ROLE_" + rolNormalizado;
        }
        
        return rolNormalizado;
    }

    public String obtenerNombreRolPorId(Integer idRol) {
        return rolesCache.getOrDefault(idRol, "ROLE_USER");
    }
    
    public void refrescarCache() {
        rolesCache.clear();
        cargarRolesEnCache();
    }
}