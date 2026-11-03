import sys
import os
from pathlib import Path

# Adiciona a pasta api ao path para os módulos serem encontrados
api_dir = Path(__file__).resolve().parent / 'api'
sys.path.insert(0, str(api_dir))

from api import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0' if os.environ.get('PORT') else '127.0.0.1'
    app.run(host=host, port=port, debug=False)
