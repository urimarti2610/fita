"""Central brand configuration, mirroring packages/core/src/brand.ts.

The plugin's import name (``calibre_plugins.fita``) and the marker file
``plugin-import-name-fita.txt`` must match ``ID``; build.py checks it.
"""

NAME = "fita"
ID = "fita"
WEBSITE = "https://fitaread.com"
REPOSITORY = "https://github.com/urimarti2610/fita"

#: Class of the emphasized start of a word (same as the web converter).
EMPHASIS_CLASS = f"{ID}-e"
#: Class of the plain rest of a word, for the styles that fade it.
REST_CLASS = f"{ID}-r"
