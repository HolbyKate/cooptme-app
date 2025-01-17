#!/bin/bash

# Chemin vers le répertoire du backend (où se trouve le script)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Activation de l'environnement virtuel
source venv/bin/activate

# Exécution du script Python
python scripts/import_linkedin.py

# Désactivation de l'environnement virtuel
deactivate