# Diagram sources

Each `*.html` here renders to the matching `*.png` used in the docs. They share `_base.css` (Elastly
brand tokens). To change a diagram, edit its HTML and re-render:

    ./art/render.sh <name>       # renders art/<name>.html -> art/<name>.png

PNGs are referenced from MDX as `/art/<name>.png`.
