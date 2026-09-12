Oui. Avec la version actuelle de `@php-wasm/web`, le principe est d’exécuter PHP directement dans le navigateur avec WebAssembly. Le paquet officiel montre notamment l’utilisation de `PHP` depuis `@php-wasm/universal` et de `loadWebRuntime()` depuis `@php-wasm/web`. ([npm][1])

### 1. Créer le projet

```bash
mkdir php-browser
cd php-browser

npm init -y
npm install @php-wasm/web @php-wasm/universal
npm install -D vite
```

Structure :

```text
php-browser/
├── index.html
├── src/
│   └── main.js
├── package.json
└── ...
```

### 2. `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>PHP dans le navigateur</title>
</head>
<body>

    <h1>Hello World PHP</h1>

    <pre id="output">Chargement...</pre>

    <script type="module" src="/src/main.js"></script>

</body>
</html>
```

### 3. `src/main.js`

```javascript
import { PHP } from '@php-wasm/universal';
import { loadWebRuntime } from '@php-wasm/web';

const output = document.getElementById('output');

async function main() {
    try {
        // Charger PHP WebAssembly
        const runtime = await loadWebRuntime('8.5');

        // Créer une instance PHP
        const php = new PHP(runtime);

        // Écrire un fichier PHP dans le système de fichiers virtuel
        php.writeFile(
            '/hello.php',
            `<?php
                echo "Hello World !";
            ?>`
        );

        // Exécuter le fichier PHP
        const response = await php.runStream({
            scriptPath: '/hello.php'
        });

        // Afficher le résultat dans la page
        output.textContent = await response.stdoutText;

    } catch (error) {
        output.textContent = error.toString();
        console.error(error);
    }
}

main();
```

Cette approche reprend directement le modèle documenté par `@php-wasm/web` : charger le runtime PHP, écrire un fichier PHP dans le système de fichiers virtuel, puis l'exécuter avec `runStream()`. ([npm][1])

### 4. Ajouter le script NPM

Dans `package.json` :

```json
{
    "scripts": {
        "dev": "vite"
    }
}
```

Puis :

```bash
npm run dev
```

Ouvre l'adresse indiquée par Vite. Tu devrais obtenir :

```text
Hello World !
```

### Variante encore plus simple

Il est aussi possible d'exécuter du PHP directement avec `code`, sans créer `hello.php` :

```javascript
import { PHP } from '@php-wasm/universal';
import { loadWebRuntime } from '@php-wasm/web';

const php = new PHP(await loadWebRuntime('8.5'));

const response = await php.runStream({
    code: '<?php echo "Hello World !";'
});

console.log(await response.stdoutText);
```

La documentation récente montre explicitement cette forme avec `runStream({ code: ... })`. ([Make WordPress][2])

Pour ton **éditeur PHP dans le navigateur**, la deuxième approche est particulièrement intéressante : **éditeur → code PHP → `php.runStream()` → stdout → console/zone de résultat**.

[1]: https://www.npmjs.com/package/%40php-wasm/web?utm_source=chatgpt.com "@php-wasm/web - npm"
[2]: https://make.wordpress.org/playground/2026/01/08/a-lighter-more-modular-wordpress-playground-understanding-the-php-wasm-package-split/?utm_source=chatgpt.com "A Lighter, More Modular WordPress Playground: Understanding the php-wasm Package Split – WordPress Playground"
