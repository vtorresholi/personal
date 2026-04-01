# Mini web sorpresa

## Qué incluye
- Pantalla con código secreto de 4 dígitos
- Carta virtual
- Tarjeta tipo scratch para revelar una sorpresa
- Diseño romántico responsive

## Qué debes cambiar

### 1) Código secreto
Abre `script.js` y cambia esta línea:
```js
const SECRET_CODE = '1999';
```

### 2) Texto de la carta
Abre `index.html` y reemplaza los párrafos dentro de `.letter-text`.

### 3) Sorpresa final
En `index.html`, dentro de `#revealContent`, puedes:
- dejar un mensaje
- poner una foto
- poner una invitación

Ejemplo con foto:
```html
<div id="revealContent" class="reveal-content">
  <img src="foto.jpg" alt="Nosotros" style="width:100%;height:100%;object-fit:cover;" />
</div>
```

Luego sube también `foto.jpg` a la misma carpeta.

## Publicarlo gratis en GitHub Pages
1. Crea una cuenta en GitHub.
2. Crea un repositorio nuevo, por ejemplo: `sorpresa-para-gio`.
3. Sube todos los archivos de esta carpeta.
4. Ve a `Settings` > `Pages`.
5. En `Build and deployment`, elige:
   - Source: `Deploy from a branch`
   - Branch: `main` y carpeta `/root`
6. Guarda y espera unos segundos.
7. GitHub te dará un enlace público.

