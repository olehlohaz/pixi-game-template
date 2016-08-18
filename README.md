# Game Template

### Folder Structure ###

* app
  * assets (save assets here, it's going to be copied to the release build)
  * core 
    * components 
    * controllers
    * effects
    * ui
    * utils
  * game (your game files here)
    * scenes

### Packages ###

* PIXI (Rendering)
* Howler (Sound)
* pixi-particles (Particles Effects)

Size of the game stage can be configured here:
config: {stageWidth, stageHeight}

Commands:
- npm install (install all packages needed)
- npm run start (start the server on localhost:8080)
- npm run build (build the release version on /build)

### Webpack ###

#### loaders ####
check for files: .js, .html, .jpg, .jpeg, .png, .svg, .mp3, .ogg, .json (anything other than that need to be added othewise won't be visible on the server)

#### entries ####

default entry:
- game ->  ['./app/app.js'] (create the file)-> game.js


Note: Template originaly based on Pixi-Seed (https://github.com/edwinwebb/pixi-seed)
