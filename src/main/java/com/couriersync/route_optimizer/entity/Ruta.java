package com.couriersync.route_optimizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tbl_rutas")
@Data

public class Ruta {

    @Id
    @Column(name = "id_ruta", nullable = false, unique = true)
    private Integer idRuta;

    @Column(name = "vehiculo_asociado", length = 25)
    private String vehiculoAsociado;

    @Column(name = "conductor_asignado", length = 25)
    private String conductorAsignado;

    @Column(name = "id_estado", nullable = false)
    private Integer idEstado;

    @Column(name = "distancia_total", nullable = false)
    private Double distanciaTotal;

    @Column(name = "tiempo_promedio", nullable = false)
    private Double tiempoPromedio;

    @Column(name = "id_trafico", nullable = false)
    private Integer idTrafico;

    @Column(name = "prioridad", nullable = false)
    private Short prioridad;

    // Getters y Setters generados por Lombok
}
