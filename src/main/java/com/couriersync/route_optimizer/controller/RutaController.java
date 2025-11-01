package com.couriersync.route_optimizer.controller;

import com.couriersync.route_optimizer.entity.Ruta;
import com.couriersync.route_optimizer.service.RutaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/routes")
public class RutaController {

    @Autowired
    private RutaService rutaService;

    // Crear una nueva ruta
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
}

