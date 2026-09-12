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