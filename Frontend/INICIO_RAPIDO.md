# 🚀 Inicio Rápido - Conexión Frontend con Backend Spring

## ✅ Lo que ya está listo

1. ✅ **Axios instalado** - Cliente HTTP para peticiones
2. ✅ **Servicios de API creados** - Estructura lista para usar
3. ✅ **Configuración de Vite** - Proxy opcional configurado
4. ✅ **Documentación completa** - Guías detalladas creadas

## 📋 Pasos Inmediatos

### 1. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto (`distri-dash-lite-main/.env`):

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
```

**⚠️ IMPORTANTE:** Ajusta el puerto si tu backend Spring corre en otro puerto (por ejemplo, 8081, 9090, etc.)

### 2. Verificar tu Backend Spring

Asegúrate de que tu backend tenga:

- ✅ CORS configurado para permitir peticiones desde `http://localhost:8080`
- ✅ Endpoints REST bajo el contexto `/api`
- ✅ Autenticación JWT implementada
- ✅ Controladores con las rutas esperadas

### 3. Información que necesito de tu Backend

Para ayudarte a completar la integración, necesito que me proporciones:

#### A. Estructura de Endpoints
¿Tus endpoints siguen esta estructura?
- `/api/auth/login`
- `/api/auth/register`
- `/api/usuarios`
- `/api/rutas`

Si son diferentes, indícame cuál es la estructura real.

#### B. Formato de Respuestas
¿Las respuestas de tu backend tienen este formato?

**Login:**
```json
{
  "token": "...",
  "usuario": { ... }
}
```

O es diferente? Por ejemplo:
```json
{
  "accessToken": "...",
  "user": { ... }
}
```

#### C. Autenticación
- ¿Usas JWT? ¿Qué nombre tiene el header? (¿`Authorization: Bearer` o `X-Auth-Token`?)
- ¿Dónde se guarda el token en el frontend? (¿localStorage, sessionStorage, cookies?)

#### D. Modelos de Datos
¿Los modelos de `Usuario` y `Ruta` en tu backend coinciden con estos?

**Usuario:**
- cedula (string)
- nombre (string)
- apellido (string)
- email (string)
- celular (string)
- rol (enum: "Gestor de Rutas" | "Auditor" | "Conductor")
- password (solo para registro)

**Ruta:**
- idRuta (string)
- distanciaTotal (number)
- tiempoPromedio (number)
- traficoPromedio (string)
- prioridad (string)
- estadoRuta (string)
- vehiculoAsignado (objeto opcional)
- conductorAsignado (objeto opcional)

Si hay diferencias, indícame cuáles son.

#### E. CORS
¿Ya tienes CORS configurado? Si no, puedo ayudarte a configurarlo.

## 🔧 Próximos Pasos (Después de obtener la información)

1. **Ajustar servicios de API** según tu estructura real
2. **Actualizar componentes** para usar los servicios
3. **Probar la conexión** end-to-end
4. **Manejar errores** específicos de tu backend

## 📚 Documentación Disponible

- **`CONEXION_BACKEND.md`** - Guía completa de conexión
- **`ENDPOINTS_REQUERIDOS.md`** - Especificación detallada de endpoints
- **`src/services/`** - Servicios de API listos para usar
- **`src/pages/Login.example.tsx`** - Ejemplo de migración de componente

## 🆘 ¿Necesitas ayuda ahora?

Si quieres que actualice los servicios ahora mismo con una estructura específica, compárteme:

1. La URL base de tu API (si es diferente a `/api`)
2. Un ejemplo de respuesta de login
3. La estructura de tus modelos
4. Cualquier diferencia en los nombres de campos

Con esa información, puedo ajustar todo el código automáticamente.

