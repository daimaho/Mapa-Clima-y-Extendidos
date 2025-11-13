== INSTRUCCIONES PARA EL OPERADOR DE TV ==

Este sistema de pronóstico del tiempo está diseñado para salir al aire a través de NDI.

---
PASOS PARA LA PUESTA EN MARCHA:
---

1.  **ABRIR EL ARCHIVO**:
    Navegue a la carpeta del proyecto y haga doble clic en el archivo `index.html` para abrirlo en un navegador web (se recomienda Google Chrome).

2.  **PANTALLA COMPLETA**:
    Una vez que la página cargue, presione la tecla `F11` para poner el navegador en modo de pantalla completa. Esto es crucial para que no se vean barras de herramientas o bordes de ventana en la salida de video.

3.  **CONFIGURAR NDI SCAN CONVERTER**:
    - Abra la aplicación "NDI Scan Converter" que viene con NDI Tools.
    - Haga clic derecho en el ícono de NDI en la barra de tareas (cerca del reloj).
    - En el menú, seleccione la ventana del navegador que contiene el pronóstico del tiempo. Debería aparecer con el título "Clima TV".

4.  **SELECCIONAR FUENTE EN TRICASTER**:
    - En su TriCaster (o sistema de producción compatible con NDI), agregue una nueva fuente de video NDI.
    - La fuente aparecerá con el nombre de la PC y la ventana seleccionada (ej: `MI-PC (Chrome)`). Selecciónela.
    - La salida del pronóstico del tiempo ya estará disponible como una fuente de video en su switcher.

---
CÓMO OPERAR EN VIVO:
---

El control es principalmente a través del teclado. NO HAGA CLIC EN LA PANTALLA una vez en la vista de pronóstico.

1.  **CARGAR DATOS**:
    - Al iniciar, verá un **Menú Principal**.
    - Haga clic en el botón **"Actualizar Datos"**. El sistema descargará la información más reciente del clima.
    - Una vez cargado, la pantalla cambiará automáticamente a la vista de pronóstico.

2.  **NAVEGAR ENTRE LOCALIDADES**:
    - Use las flechas Izquierda (`←`) y Derecha (`→`) para pasar a la localidad anterior o siguiente. El cambio es instantáneo y sin cortes.

3.  **SELECCIÓN DIRECTA DE LOCALIDAD**:
    - Presione las teclas numéricas del `1` al `6` para saltar directamente a una localidad específica:
      - `1`: Resistencia
      - `2`: Taco Pozo
      - `3`: Juan José Castelli
      - `4`: Villa Ángela
      - `5`: General José de San Martín
      - `6`: Presidencia Roque Sáenz Peña

4.  **VOLVER AL MENÚ**:
    - Presione la tecla `Escape` (`Esc`) para regresar al Menú Principal en cualquier momento.

---
IMPORTANTE:
---
- Los datos del clima **no se actualizan automáticamente**. Para obtener un nuevo pronóstico, debe volver al menú (`Esc`) y presionar "Actualizar Datos" nuevamente.
- Asegúrese de que la ventana del navegador con el `index.html` esté siempre en foco (seleccionada) para que las teclas de control funcionen.
- No hay botones ni menús visibles en la pantalla de pronóstico para mantener la salida de video limpia.
