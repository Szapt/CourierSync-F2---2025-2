package com.couriersync.route_optimizer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.couriersync.route_optimizer.entity.Ruta;
import com.couriersync.route_optimizer.entity.TipoTrafico;
import com.couriersync.route_optimizer.entity.EstadoRuta;
import com.couriersync.route_optimizer.repository.RutaRepository;
import com.couriersync.route_optimizer.repository.EstadoRutaRepository;
import com.couriersync.route_optimizer.repository.TipoTraficoRepository;

import java.util.Optional;
import java.util.List;

@Service
public class RutaService {

    @Autowired
    private RutaRepository rutaRepository;

    @Autowired
    private EstadoRutaRepository estadoRutaRepository;

    @Autowired
    private TipoTraficoRepository tipoTraficoRepository;
    // Crear nueva ruta
    public Ruta crearRuta(Ruta ruta) {
        // Si no se proporciona ID, generar uno automáticamente
        if (ruta.getIdRuta() == null) {
            // Obtener el máximo ID existente y sumar 1
            List<Ruta> todasLasRutas = rutaRepository.findAll();
            Integer maxId = todasLasRutas.stream()
                .map(Ruta::getIdRuta)
                .filter(id -> id != null)
                .max(Integer::compareTo)
                .orElse(0);
            ruta.setIdRuta(maxId + 1);
        } else if (rutaRepository.existsById(ruta.getIdRuta())) {
            throw new DataIntegrityViolationException("El ID de la ruta ya existe.");
        }

        if (ruta.getDistanciaTotal() == null || ruta.getTiempoPromedio() == null ||
            ruta.getIdTrafico() == null || ruta.getPrioridad() == null) {
            throw new IllegalArgumentException("Faltan campos obligatorios en la ruta.");
        }

        if (ruta.getIdEstado() == null) {
            ruta.setIdEstado(1); // estado activo por defecto
        }

        return rutaRepository.save(ruta);
    }

    // Editar ruta existente
    public Ruta actualizarRuta(Integer idRuta, Ruta rutaActualizada) {
        Optional<Ruta> existenteOpt = rutaRepository.findById(idRuta);
        if (existenteOpt.isEmpty()) {
            throw new IllegalArgumentException("Ruta no encontrada con id: " + idRuta);
        }

        Ruta existente = existenteOpt.get();

        // Solo se actualizan los campos que se envíen con valor
        if (rutaActualizada.getVehiculoAsociado() != null)
            existente.setVehiculoAsociado(rutaActualizada.getVehiculoAsociado());

        if (rutaActualizada.getConductorAsignado() != null)
            existente.setConductorAsignado(rutaActualizada.getConductorAsignado());

        if (rutaActualizada.getDistanciaTotal() != null)
            existente.setDistanciaTotal(rutaActualizada.getDistanciaTotal());

        if (rutaActualizada.getTiempoPromedio() != null)
            existente.setTiempoPromedio(rutaActualizada.getTiempoPromedio());

        if (rutaActualizada.getIdTrafico() != null)
            existente.setIdTrafico(rutaActualizada.getIdTrafico());

        if (rutaActualizada.getPrioridad() != null)
            existente.setPrioridad(rutaActualizada.getPrioridad());

        if (rutaActualizada.getIdEstado() != null)
            existente.setIdEstado(rutaActualizada.getIdEstado());

        return rutaRepository.save(existente);
    }

    // Eliminar ruta por ID
    public void eliminarRuta(Integer idRuta) {
        if (!rutaRepository.existsById(idRuta)) {
            throw new IllegalArgumentException("Ruta no encontrada con id: " + idRuta);
        }
        rutaRepository.deleteById(idRuta);
    }

    public List<Ruta> obtenerTodasLasRutas() {
        return rutaRepository.findAll();
    }

    // Buscar rutas por nombre de estado
    public List<Ruta> buscarRutasPorNombreEstado(String nombreEstado) {
        EstadoRuta estado = estadoRutaRepository.findByNombreEstado(nombreEstado);
        if (estado == null) {
            throw new IllegalArgumentException("Estado no encontrado: " + nombreEstado);
        }
        Integer idEstado = estado.getIdEstado();
        return rutaRepository.findByIdEstado(idEstado);
    }

    public List<Ruta> buscarRutasPorTrafico(String nivelTrafico) {
        TipoTrafico trafico = tipoTraficoRepository.findByNivelTrafico(nivelTrafico);
        if (trafico == null) {
            throw new IllegalArgumentException("Trafico no encontrado: " + nivelTrafico);
        }
        return rutaRepository.findByIdTrafico(trafico.getIdTrafico());
    }

    public List<Ruta> obtenerRutasPorTraficoAsc() {
        return rutaRepository.findAllByOrderByIdTraficoAsc();
    }
    // Obtener todos los estados disponibles
    public List<EstadoRuta> obtenerTodosLosEstados() {
        return estadoRutaRepository.findAll();
    }
    
    
    
}

