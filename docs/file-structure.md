# File Structure
## /content
Contains non-code files and images used in the application
## /css
Contains CSS files
## /docs
Contains these documentation files
## /input
Contains sample input files
## /js
Contains code
- /js/lib: Contains libraries included in the project
	- /js/lib/jcanvas.min.js - jCanvas
	- /js/lib/jquery-3.6.0.min.js - jQuery
- /js/popup.js: Code that controls the pop-ups. Includes callbacks for interactive components.
- /js/bar.js: Code that controls the top configuration bar. Includes callbacks for interactive components.
- /js/renderer.js: Code that controls the jCanvas rendering.
- /js/sidebar.js: Code that controls the sidebar. Includes callbacks for interactive components.
- /js/structs.js: Backend structures used to organize map and service center data.
- /js/USMap.js: Contains a single JSON object used to render the United States.
## /index.html
Contains main page