package com.couriersync.route_optimizer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.couriersync.route_optimizer.entity.Ruta;
import com.couriersync.route_optimizer.service.RutaService;

@RestController
@RequestMapping("api/routes/create-route")
public class RutaController {

    @Autowired
    private RutaService rutaService;

    @PostMapping
    public ResponseEntity<?> crearRuta(@RequestBody Ruta ruta) {
        try {
            Ruta nueva = rutaService.crearRuta(ruta);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Error: " + e.getMessage());

        } catch (DataIntegrityViolationException e) {
           
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Error: " + e.getMessage());

        } catch (Exception e) {
           
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error inesperado. Intente más tarde.");
        }
    }
}
