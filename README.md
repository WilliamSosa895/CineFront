# Descripcion del proyecto frontend

## 1. Proposito

Este documento describe la parte frontend del sistema de cine, su papel dentro de la arquitectura general y la forma en que interactua con el backend.

## 2. Vision general

El frontend esta desarrollado con React y Vite. Su funcion es proporcionar la interfaz visual del sistema, permitiendo al usuario consultar la cartelera, registrarse, iniciar sesion, seleccionar asientos, comprar dulceria y acceder a las funciones administrativas.

## 3. Responsabilidades principales

El frontend se encarga de:

- mostrar la experiencia de usuario,
- navegar entre paginas y secciones,
- consumir la API del backend mediante HTTP,
- manejar el estado visual de formularios y vistas,
- proteger rutas segun el rol del usuario,
- presentar los flujos de compra y administracion.

## 4. Estructura general

La aplicacion esta organizada por paginas, componentes reutilizables, contexto de autenticacion, utilidades y capas de consumo de API. Esta distribucion facilita mantener separadas la presentacion, la navegacion y la logica de interfaz.

## 5. Areas funcionales

### 5.1 Autenticacion

Incluye las pantallas de login y registro, asi como la gestion del usuario autenticado dentro de la aplicacion.

### 5.2 Cartelera y funciones

Presenta las peliculas disponibles, sus funciones y la informacion necesaria para que el usuario seleccione una opcion de compra.

### 5.3 Compra de boletos

Permite seleccionar asientos, revisar el resumen de compra y completar el proceso de pago.

### 5.4 Compra de dulceria

Muestra productos, combos y el flujo necesario para finalizar la compra de dulceria.

### 5.5 Panel administrativo

Ofrece las interfaces para administrar peliculas, funciones y demas recursos del sistema.

## 6. Relacion con el backend

El frontend no almacena la logica principal del negocio. En su lugar, consume la API del backend para obtener datos, enviar formularios y recibir respuestas que luego se presentan al usuario.

## 7. Conclusion

El frontend constituye la capa visible del sistema. Su objetivo es traducir las capacidades del backend en una experiencia clara y funcional para el usuario final, manteniendo una estructura modular y facil de mantener.