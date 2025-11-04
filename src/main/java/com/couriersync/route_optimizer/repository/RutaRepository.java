package com.couriersync.route_optimizer.repository;



import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.couriersync.route_optimizer.entity.Ruta;

public interface RutaRepository extends JpaRepository<Ruta, Integer> {
    Ruta findByIdRuta(Integer idRuta);
    List<Ruta> findByTiempoPromedio(Double tiempoPromedio);
    List<Ruta> findByIdTrafico(Integer idTrafico);
    List<Ruta> findByPrioridad(Short prioridad);
    List<Ruta> findByIdEstado(Integer idEstado);
    List<Ruta> findAllByTraficoAsc();
}

