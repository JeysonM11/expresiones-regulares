# Proyecto Next.js - Validación con Autómatas Gramaticales

Este proyecto en Next.js aplica autómatas gramaticales a un formulario para validar los datos ingresados por los usuarios. También incluye funcionalidad para importar y exportar datos en formato JSON.

## Características
- Validación de datos usando autómatas gramaticales.
- Campos validados:
  - **Nombre Estudiante**: Nombre completo.
  - **Código Estudiante**: Código de 8 dígitos.
  - **Fecha de Ingreso**: Formato `dd/mm/aaaa`.
  - **Dirección**: Entrada de dirección.
  - **Teléfono Fijo**: Formato `(6056XXXXXX)`.
  - **Teléfono Celular**: Formato `(3XXXXXXXXX)`.
  - **Correo Electrónico**: Validación de email.
- Funcionalidad para importar y exportar datos en formato JSON.

## Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JeysonM11/expresiones-regulares.git
   cd tu-repo
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el proyecto en desarrollo:
   ```bash
   npm run dev
   ```

## Uso
1. Acceder a `http://localhost:3000` en el navegador.
2. Completar el formulario con los datos requeridos.
3. Recibir validaciones en tiempo real basadas en autómatas gramaticales.
4. Utilizar las opciones de importar y exportar JSON.

## Importación y Exportación de JSON
- **Importar JSON**: Permite cargar datos desde un archivo JSON.
- **Exportar JSON**: Descarga los datos ingresados en un archivo JSON.

## Tecnologías Utilizadas
- **Next.js** - Framework para React.
- **Tailwind CSS** - Para estilos.
- **Autómatas Gramaticales** - Para la validación de datos.
- **JSON** - Para importación y exportación de datos.

## Autor
Desarrollado por 
[2A2G](https://github.com/2A2G)
[JeysonM11](https://github.com/JeysonM11).

## Licencia
Este proyecto está bajo la licencia MIT.
