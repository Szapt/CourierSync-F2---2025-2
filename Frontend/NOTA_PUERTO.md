# ⚠️ Nota Importante: Puerto del Frontend

## Situación Actual

El frontend está corriendo en el puerto **8081** porque el puerto **8080** está ocupado (probablemente por el backend Spring Boot).

## Configuración Actual

- **Backend**: `http://localhost:8080`
- **Frontend**: `http://localhost:8081`

## ⚠️ Importante: CORS

Si el frontend corre en un puerto diferente al 8080, necesitas actualizar la configuración CORS en el backend para incluir el puerto 8081:

### Opción 1: Actualizar CORS en el Backend (Recomendado)

En tu backend Spring Boot, actualiza la configuración CORS:

```java
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081"})
```

O configuración global:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/CourierSync/api/**")
                        .allowedOrigins("http://localhost:8080", "http://localhost:8081")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### Opción 2: Cambiar Puerto del Frontend

Si prefieres que el frontend use otro puerto fijo, edita `vite.config.ts`:

```typescript
server: {
  host: "::",
  port: 5173, // O cualquier otro puerto disponible
}
```

Y actualiza CORS en el backend para incluir ese puerto.

## ✅ Verificación

1. Abre el frontend en: `http://localhost:8081`
2. Intenta hacer login
3. Si ves error de CORS, actualiza la configuración del backend como se indica arriba

---

**Nota:** El archivo `.env` ya está configurado correctamente con la URL del backend (`http://localhost:8080/CourierSync/api`), así que las peticiones se harán correctamente. Solo necesitas asegurarte de que CORS permita el origen del frontend.

