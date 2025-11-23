# 🚀 Guía Paso a Paso para Ejecutar Frontend y Backend

## 📋 Requisitos Previos

- ✅ Node.js instalado (versión 18 o superior)
- ✅ Java 21 instalado
- ✅ Maven instalado
- ✅ Backend Spring Boot configurado y funcionando

## 🔧 Paso 1: Configurar el Frontend

### 1.1. Navegar al directorio del frontend

```bash
cd distri-dash-lite-main
```

### 1.2. Instalar dependencias

```bash
npm install
```

### 1.3. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto frontend con el siguiente contenido:

```env
VITE_API_BASE_URL=http://localhost:8080/CourierSync/api
VITE_API_TIMEOUT=10000
```

**⚠️ IMPORTANTE:** Ajusta la URL si tu backend corre en otro puerto o tiene una configuración diferente.

### 1.4. Verificar que axios esté instalado

```bash
npm list axios
```

Si no está instalado:

```bash
npm install axios
```

## 🔧 Paso 2: Configurar el Backend

### 2.1. Verificar configuración CORS

Asegúrate de que tu backend Spring tenga configurado CORS para aceptar peticiones desde `http://localhost:8080`:

**Opción A: En el controlador principal**

```java
@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/CourierSync/api")
public class TuControlador {
    // ...
}
```

**Opción B: Configuración global**

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/CourierSync/api/**")
                        .allowedOrigins("http://localhost:8080")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### 2.2. Verificar que el backend esté configurado correctamente

- ✅ Context path: `/CourierSync/api`
- ✅ Puerto: `8080` (o el que uses)
- ✅ Base de datos configurada
- ✅ Endpoints funcionando

## 🚀 Paso 3: Ejecutar el Backend

### 3.1. Navegar al directorio del backend

```bash
cd ruta/a/tu/backend
```

### 3.2. Ejecutar con Maven

```bash
mvn spring-boot:run
```

O si usas el wrapper de Maven:

```bash
./mvnw spring-boot:run
```

### 3.3. Verificar que el backend esté corriendo

Abre tu navegador o usa curl:

```bash
curl http://localhost:8080/CourierSync/api/routes/estados
```

Deberías recibir una respuesta JSON con los estados disponibles.

## 🚀 Paso 4: Ejecutar el Frontend

### 4.1. En una nueva terminal, navegar al frontend

```bash
cd distri-dash-lite-main
```

### 4.2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 4.3. Verificar que el frontend esté corriendo

El frontend debería estar disponible en: `http://localhost:8080`

**⚠️ NOTA:** El frontend y el backend comparten el puerto 8080. Si hay conflicto:
- Cambia el puerto del frontend en `vite.config.ts` (ej: 5173)
- O cambia el puerto del backend en `application.properties`

## ✅ Paso 5: Verificar la Conexión

### 5.1. Abrir el navegador

Navega a: `http://localhost:8080`

### 5.2. Probar el login

1. Intenta hacer login con credenciales válidas
2. Verifica que se guarde el token
3. Verifica que puedas acceder al dashboard

### 5.3. Verificar en las herramientas de desarrollador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network" (Red)
3. Intenta hacer una operación (ej: ver rutas)
4. Verifica que las peticiones se envíen correctamente al backend
5. Verifica las respuestas del servidor

## 🐛 Solución de Problemas

### Error: CORS policy blocked

**Solución:**
- Verifica que CORS esté configurado en el backend
- Verifica que el origen sea correcto (`http://localhost:8080`)
- Si el frontend corre en otro puerto, actualiza CORS en el backend

### Error: Network Error o Connection Refused

**Solución:**
- Verifica que el backend esté ejecutándose
- Verifica que la URL en `.env` sea correcta
- Verifica que el puerto del backend sea el correcto
- Verifica que no haya firewall bloqueando la conexión

### Error: 401 Unauthorized

**Solución:**
- Verifica que el token se esté enviando correctamente
- Verifica que el token no haya expirado (24 horas)
- Intenta hacer login nuevamente

### Error: 404 Not Found

**Solución:**
- Verifica que los endpoints en el backend coincidan con los esperados
- Verifica que el context path sea `/CourierSync/api`
- Revisa la consola del navegador para ver la URL exacta que se está llamando

### Error: Puerto 8080 ya en uso

**Solución Frontend:**
Cambia el puerto en `vite.config.ts`:

```typescript
server: {
  host: "::",
  port: 5173, // Cambiar a otro puerto
}
```

Y actualiza CORS en el backend para incluir el nuevo puerto.

**Solución Backend:**
Cambia el puerto en `application.properties`:

```properties
server.port=8081
```

Y actualiza `VITE_API_BASE_URL` en `.env`:

```env
VITE_API_BASE_URL=http://localhost:8081/CourierSync/api
```

## 📝 Checklist de Verificación

Antes de considerar que todo está funcionando, verifica:

- [ ] Backend ejecutándose sin errores
- [ ] Frontend ejecutándose sin errores
- [ ] Archivo `.env` creado y configurado
- [ ] CORS configurado en el backend
- [ ] Login funciona correctamente
- [ ] Token se guarda en localStorage
- [ ] Dashboard se carga después del login
- [ ] Las peticiones se ven en la pestaña Network
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del backend

## 🎯 Próximos Pasos

Una vez que ambos proyectos estén corriendo:

1. **Probar todas las funcionalidades:**
   - Login/Logout
   - Registro
   - Ver rutas
   - Crear ruta (si tienes permisos)
   - Editar ruta (si tienes permisos)
   - Eliminar ruta (si tienes permisos)
   - Ver equipo
   - Ver análisis

2. **Verificar permisos:**
   - Admin puede hacer todo
   - Gestor de Rutas puede crear/editar rutas
   - Conductor solo ve sus rutas asignadas

3. **Probar MFA (si está habilitado):**
   - Login con usuario que tiene MFA
   - Ingresar código TOTP
   - Verificar que funcione

## 📚 Recursos Adicionales

- **Documentación del Backend:** Revisa la documentación de tu backend para endpoints específicos
- **Console del Navegador:** Revisa errores de JavaScript
- **Network Tab:** Revisa las peticiones HTTP y respuestas
- **Backend Logs:** Revisa los logs del backend para errores del servidor

---

**¡Listo!** Si sigues estos pasos, deberías tener ambos proyectos corriendo y comunicándose correctamente. 🎉

