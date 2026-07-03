#  Facebook Marquet

Facebook Marquet es una aplicación web desarrollada con React  y Firebase, inspirada en Facebook Marketplace, que permite visualizar, administrar y gestionar productos almacenados en Cloud Firestore.

##  Características

- Visualización de productos almacenados en Firebase Firestore.
- Detalle de cada producto.
- Carrito de compras.
- Administración de productos mediante formulario.
- Navegación mediante React Router.
- Interfaz responsive.
- Integración con Firebase.

---

## Tecnologías utilizadas

- React
- Vite
- Firebase
- Cloud Firestore
- React Router DOM
- JavaScript (ES6+)
- HTML5
- CSS3

---

## 📂 Estructura del proyecto

```
facebookmarquet
│
├── public/
├── src/
│   ├── Componentes/
│   ├── context/
│   ├── firebase/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

##  Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js 18 o superior
- npm

Puede descargarse desde:

https://nodejs.org/

---

##  Instalación

### 1. Clonar el repositorio


### 1. Clonar el repositorio

```bash
git clone https://github.com/arieldelgado22/FacebukMarquet.git
```

### 2. Ingresar al proyecto

```bash
cd FacebukMarquet
```

### 3. Instalar dependencias

```bash
npm install
```


---

##  Ejecutar el proyecto

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```
http://localhost:5173
```

Abrir esa dirección en el navegador.

---

## Configuración de Firebase

El proyecto utiliza Firebase para:

- Authentication
- Cloud Firestore

La configuración se encuentra en:

```
src/config.js
```

Es necesario crear un proyecto en Firebase e incorporar las credenciales correspondientes.

---

##  Base de datos

La aplicación utiliza Cloud Firestore.

Colección principal:

```
productos nacionales
```

Cada documento contiene información similar a:

```json
{
  "id": 1,
  "nombre": "Producto",
  "precio": 25000,
  "stock": 10,
  "imagen": "URL de la imagen"
}
```

---

##  Funcionalidades

- Listado de productos.
- Vista detallada de productos.
- Carrito de compras.
- Gestión de productos.
- Navegación entre páginas.
- Integración con Firebase.

---

##  Scripts disponibles

Instalar dependencias

```bash
npm install
```

Ejecutar en modo desarrollo

```bash
npm run dev
```

Compilar para producción

```bash
npm run build
```

Vista previa de producción

```bash
npm run preview
```
