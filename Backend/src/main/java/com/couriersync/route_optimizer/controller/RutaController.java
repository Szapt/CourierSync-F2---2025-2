package com.couriersync.route_optimizer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.couriersync.route_optimizer.entity.EstadoRuta;
import com.couriersync.route_optimizer.entity.Ruta;
import com.couriersync.route_optimizer.service.RutaService;


@RestController
@RequestMapping("/routes")
public class RutaController {

    @Autowired
    private RutaService rutaService;

    // Crear una nueva ruta
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> crearRuta(@RequestBody Ruta ruta) {
        try {
            Ruta nueva = rutaService.crearRuta(ruta);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado. Intente más tarde.");
        }
    }

    // Editar una ruta existente
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTORRUTA')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> actualizarRuta(@PathVariable("id") Integer idRuta, @RequestBody Ruta rutaActualizada) {
        try {
            Ruta actualizada = rutaService.actualizarRuta(idRuta, rutaActualizada);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado. Intente más tarde.");
        }
    }

    // Eliminar una ruta por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> eliminarRuta(@PathVariable("id") Integer idRuta) {
        try {
            rutaService.eliminarRuta(idRuta);
            return ResponseEntity.ok("Ruta eliminada correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado. Intente más tarde.");
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTORRUTA') or hasRole('AUDITOR')")
    @GetMapping("/get/all")
    public List<Ruta> obtenerTodasLasRutas() {
        return rutaService.obtenerTodasLasRutas();
    }

    // Obtener todos los estados disponibles
    @GetMapping("/estados")
    public ResponseEntity<List<EstadoRuta>> obtenerTodosLosEstados() {
        List<EstadoRuta> estados = rutaService.obtenerTodosLosEstados();
        return ResponseEntity.ok(estados);
    }

    // Buscar rutas por nombre de estado
    @GetMapping("/by-estado")
    public ResponseEntity<?> buscarRutasPorEstado(@RequestParam("estado") String nombreEstado) {
        try {
            List<Ruta> rutas = rutaService.buscarRutasPorNombreEstado(nombreEstado);
            return ResponseEntity.ok(rutas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado. Intente más tarde.");
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTORRUTA') or hasRole('AUDITOR')")
    @GetMapping("/trafico/{nivelTrafico}")
    public ResponseEntity<?> buscarRutasPorTrafico(@PathVariable("nivelTrafico") String nivelTrafico) {
        try {
            List<Ruta> rutas = rutaService.buscarRutasPorTrafico(nivelTrafico);
            return ResponseEntity.ok(rutas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado. Intente más tarde.");
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTORRUTA') or hasRole('AUDITOR')")
    @GetMapping("/trafico/all")
    public ResponseEntity<?> obtenerRutasPorTraficoAsc() {
        List<Ruta> rutas = rutaService.obtenerRutasPorTraficoAsc();
        return ResponseEntity.ok(rutas);
    }



}

