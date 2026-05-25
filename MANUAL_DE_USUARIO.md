# Manual de Usuario - Mi Negocio Aroma PRO

¡Bienvenido a tu nueva aplicación de gestión y catálogo en línea para tu negocio de ceras aromáticas!

A continuación, te explicamos cómo utilizar cada una de las funciones de la aplicación.

## 1. Acceso al Catálogo Público (Para tus clientes)
La página principal de la aplicación (`/`) es tu **Catálogo Público**.
- Tus clientes pueden ver todos los productos activos que ofreces.
- Pueden filtrar los productos por categoría: Todos, Sachet, Melt, Squeeze.
- **Carrito de compras:** Los clientes pueden añadir los productos que deseen al carrito.
- **Checkout por WhatsApp:** Al finalizar, el cliente ingresará su nombre y teléfono, y al hacer clic en "Pedir por WhatsApp", se generará un mensaje automático con el detalle del pedido y un ID de referencia. Ese mensaje se enviará a tu número de WhatsApp.
- **Registro Automático:** Simultáneamente, el pedido quedará registrado en tu panel de administración con estado "Pendiente".

## 2. Panel de Administración (Para ti)
Para gestionar tu negocio, debes ingresar al Panel de Administración ubicado en la ruta `/admin` de la aplicación. En la página principal del catálogo, también tienes un pequeño enlace "Admin" en la esquina superior derecha.

**Requisito de acceso:** Solo puedes acceder con la cuenta de Google autorizada (`abertona@gmail.com`). 

El panel está dividido en 4 secciones:

### A. Productos
Aquí gestionas tu catálogo.
- **Agregar Producto:** Haz clic en "+ Nuevo Producto", completa el nombre, precio, categoría y asegúrate de marcar la casilla "Activo en tienda" para que tus clientes puedan verlo.
- **Ocultar / Eliminar:** Puedes tener productos guardados sin que se muestren marcándolos como inactivos (Oculto). También puedes eliminar productos que ya no vendas.

### B. Materiales (Stock)
Un inventario ágil de tus insumos (ceras, esencias, mechas, colorantes, envases).
- Ingresa el nombre del material, la cantidad disponible y su unidad de medida (por ejemplo: `g`, `ml`, `unidades`).
- Este inventario es exclusivamente de control interno para saber cuándo debes reabastecerte.

### C. Órdenes (Pedidos)
Gestión de los pedidos que ingresan por la página web.
- Cada vez que un cliente te envía un pedido por WhatsApp, este aparecerá aquí.
- Verás el nombre del cliente, su teléfono, el detalle de lo que pidió y el total.
- **Estado del Pedido:** Podrás cambiar el estado de cada pedido a:
  - *Pendiente:* Recién ingresado.
  - *Completada:* Cuando ya entregaste y cobraste el pedido.
  - *Cancelada:* Si por alguna razón el pedido no se concretó.
>(**Consejo:** Solo los pedidos marcados como "Completada" sumarán a tus reportes de ventas).

### D. Reportes
Aquí podrás visualizar el rendimiento mensual de tu negocio.
- **Ingresos Totales:** La suma en dinero de todas tus ventas completadas.
- **Órdenes Atendidas:** Cantidad de pedidos que finalizaste con éxito.
- **Gráfico de Evolución de Ventas:** Un gráfico de barras que muestra cómo evolucionan tus ingresos mes a mes.

## 3. Consideraciones Adicionales
- **Número de WhatsApp:** Para que los pedidos lleguen a tu móvil, asegúrate de que el código referencie a tu número real (actualmente configurado internamente, si necesitas cambiarlo puedes solicitarlo al desarrollador de IA).
- **Seguridad y Backup:** Toda la base de datos está respaldada y alojada de forma segura en Google Cloud (Firebase). Solo tú (el administrador) puedes editar los productos, materiales y el estado de las ventas.
