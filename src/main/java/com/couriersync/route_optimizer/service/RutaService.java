package com.couriersync.route_optimizer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.couriersync.route_optimizer.entity.Ruta;
import com.couriersync.route_optimizer.repository.RutaRepository;

@Service
public class RutaService {

    @Autowired
    private RutaRepository rutaRepository;

    public Ruta crearRuta(Ruta ruta) {

        if (ruta.getIdRuta() != null && rutaRepository.existsById(ruta.getIdRuta())) {
            throw new DataIntegrityViolationException("El ID de la ruta ya existe.");
        }

        if (ruta.getDistanciaTotal() == null || ruta.getTiempoPromedio() == null ||
            ruta.getIdTrafico() == null || ruta.getPrioridad() == null) {
            throw new IllegalArgumentException("Faltan campos obligatorios en la ruta.");
        }

        if (ruta.getIdEstado() == null) {
            ruta.setIdEstado(1);
        }

        return rutaRepository.save(ruta);
    }
}
