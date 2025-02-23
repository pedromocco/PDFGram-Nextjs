# **PDFgram**

## **Tabla de Contenidos**
1. [Introducción](#introducción)
2. [Características Principales](#características-principales)
3. [Requisitos](#requisitos)
4. [Uso](#uso)
5. [Ejemplo](#ejemplo)

---

## **Introducción**

Esta aplicación permite a los usuarios llenar un formulario en el frontend, enviar los datos al backend para su procesamiento, generar un archivo PDF con los datos organizados en una tabla, y finalmente entregar el archivo PDF mediante un bot de Telegram.

Fue desarrollado pensado para la solución de una pequeña tienda de mi urbanización donde tenia problemas con el manejo de los datos de las transacciones que se hacían por transferencia, o mejor conocido en venezuela con pago móvil

La aplicación fue hecha para recibir tres tipos de datos:
1. Número de referencia de la transacción,
2. Monto de la transacción
3. Hora en la que se agregó la transacción a la tabla

(Esta version fue desarrollada con Nextjs para la demostración de su funcionalidad)

---

## **Características Principales**

- **Independencia de internet**: La aplicación escucha el estado del internet para detener los procesos o reanudad procesos del bot de telegram
- **Persistencia de datos**: Los datos apenas son añadidos a la tabla, estos persisten mediante LocalStorage
- **Opción de descargas**: Los datos al ser añadidos a la tabla, pueden ser descargados usando el mismo proceso para crear el PDF.
- **Autoeliminado de datos en servidor**: La aplicación tiene que guardar el PDF en el servidor para que ese archivo sea procesado y enviado al bot de telegram. Sin embargo este mismo tiene la capacidad de autoeliminarse una vez el mensaje haya sido enviado.
- **Uso en local**: Esta aplicación fue hecha pensada para usarse en local a pesar de ser hecha en tecnología web. Por lo tanto todas las características han sido por adaptaciones a uso en local

---

## **Requisitos**

Para usar esta aplicación, necesitarás lo siguiente:

- **Telegram**:
  - Accede a telegram y busca "@pdfgram_demo_bot" para suscribirte y comenzar a recibir los PDF a tu cuenta (Opcional)
  

---
## **Uso**
El programa enseña al usuario 2 inputs y 4 botones:

- **Número de referencia**: Sirve para introducir sólo cuatro números del número de referencia (Usualmente por comodidad se coloca los 4 últimos)
- **Monto**:Sirve para colocar el monto en Bs del número de referencia
- **Añadir**: Además de crear una tabla con la información construida en los inputs, permite añadir información introducida en los inputs
- **Descargar**: Como su nombre lo dice, este descarga la tabla actual que muestra al cliente
- **Vaciar**: Vacía la tabla actual para colocar nuevos datos
- **Enviar**: Este botón envía la tabla al bot de telegram. Una vez se haya enviado, la tabla se reinicia

Al pulsar el botón de enviar los datos viajan al backend para ser procesados como una tabla en PDF y luego ser exportada. Esta tabla contiene información como el número de referencia, monto y hora de la transacción, y al final un campo llamado "Total" hace la suma de todos los montos para dar el total de todas las transacciones.

El resultado de todo el proceso hecho sería el siguiente:

![Texto alternativo](/example.jpg "Título alternativo")