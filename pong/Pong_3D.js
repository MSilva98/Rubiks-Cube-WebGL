//////////////////////////////////////////////////////////////////////////////
//
//  Pong_3D.js
//
//  Phong Illumination Model on the GPU - Per vertex shading - Several light sources
//
//  Reference: E. Angel examples
//
//  J. Madeira - November 2017 + November 2018
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var countHits = 1;

var points = 0;

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;

var triangleVertexNormalBuffer = null;

var canvas;

// Ball
var ball_pos = [ 0.0,0.0,0.0];
var ball_vel = [ 0.0,0.0,0.0];

// Control game pontuation
var gameStarted = false;

//Panel
var panel_vel = 0.005;
var panel_size = 0.045;

var mouse;

//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//
var elapsedTime = 0;
var frameCount = 0;
var lastfpsTime = new Date().getTime();;

function countFrames() {

   var now = new Date().getTime();

   frameCount++;

   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {

       fps = frameCount;

       frameCount = 0;

       elapsedTime -= 1000;

	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}


// //----------------------------------------------------------------------------
// //
// // The WebGL code
// //

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Buffers according to the model

function initBuffers( model ) {

	// Vertex Coordinates
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
			triangleVertexPositionBuffer.itemSize,
			gl.FLOAT, false, 0, 0);


	// Vertex Normal Vectors
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
			triangleVertexNormalBuffer.itemSize,
			gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix) {

	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );

	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );

	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );

	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );

	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	initBuffers(model);   

    // Blending
    if (model.blend) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        var alpha = 0.5;

        gl.uniform1f(shaderProgram.alphaUniform, alpha);
    }


	// Material propertie
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"),
		flatten(model.kAmbi) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"),
		model.nPhong );


    // Light Sources
	var numLights = lightSources.length;

	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"),
		numLights );

	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );

		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );

		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }

	// Drawing
	if(model.primitive == 1){
		gl.drawArrays(gl.TRIANGLE_FAN,0, triangleVertexPositionBuffer.numItems);
	}
	else{
		gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	}
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

	var pMatrix;

	var mvMatrix = mat4();

	// Clearing the frame-buffer and the depth-buffer

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Computing the Projection Matrix

	// A standard view volume.

	// Ensure that the model is "inside" the view volume

	pMatrix = perspective( 45, 1, 0.05, 15 );

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// Passing the viewer position to the vertex shader
	// Viewer is at (0,0,0)	

	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten([ 0.0, 0.0, 0.0, 1.0 ]) );

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE (tz = -2.5)
	mvMatrix = translationMatrix( 0, 0, -2.5);


	// Updating the position of the light sources, if required

	// FOR EACH LIGHT SOURCE

	for(var i = 0; i < lightSources.length; i++ )
	{
		var lightSourceMatrix = mat4();

		// Passing the Light Source Matrix to apply

		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");

		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}

	// Instantianting all scene models
	for(var i = 0; i < sceneModels.length; i++ )
	{
		drawModel( sceneModels[i], mvMatrix);
	}

	// Counting the frames
	countFrames();
}

//----------------------------------------------------------------------------
//
//  Animation
//

// Animation --- Updating colors of panel and ball and turning lights ON/OFF

function animate() {

	// Ball color
	var r = document.getElementById("R").value;
	var g = document.getElementById("G").value;
	var b = document.getElementById("B").value;

	if(r > 1){
		r = 1;
	}
	if(r < 0){
		r = 0;
	}

	if(g > 1){
		g = 1;
	}
	if(g < 0){
		g = 0;
	}

	if(b > 1){
		b = 1;
	}
	if(b < 0){
		b = 0;
	}
	sceneModels[0].kDiff = [r,g,b];

	// Paddle color
	var rp = document.getElementById("Rp").value;
	var gp = document.getElementById("Gp").value;
	var bp = document.getElementById("Bp").value;

	if(rp > 1){
		rp = 1;
	}
	if(rp < 0){
		rp = 0;
	}

	if(gp > 1){
		gp = 1;
	}
	if(gp < 0){
		gp = 0;
	}

	if(bp > 1){
		bp = 1;
	}
	if(bp < 0){
		bp = 0;
	}
	sceneModels[1].kDiff = [rp,gp,bp];

	// Control Lights
	var leftLight = document.getElementById("ll");
	var rightLight = document.getElementById("rl");
	var centerLight = document.getElementById("cl");
	if(leftLight.checked == false){
		lightSources[1].switchOff();
	}
	else{
		lightSources[1].switchOn();
	}
	
	if(rightLight.checked == false){
		lightSources[0].switchOff();
	}
	else{
		lightSources[0].switchOn();
	}

	if(centerLight.checked == false){
		lightSources[2].switchOff();
	}
	else{
		lightSources[2].switchOn();
	}
}

//----------------------------------------------------------------------------
//
//  Ball related functions
//

// Shadow
function shadow_ball(){
    sceneModels[2].tx = sceneModels[0].tx;
    sceneModels[2].tz = sceneModels[0].tz;
    sceneModels[2].sx = sceneModels[2].sz = sceneModels[2].sy;
    sceneModels[2].sx = sceneModels[0].ty*0.1 +sceneModels[2].sy;
    sceneModels[2].sz = sceneModels[2].sx;
}

// Initialization
function ball_init(vx,vy,vz) {
    sceneModels[0].tx = ball_pos[0];
    sceneModels[0].ty = ball_pos[1];
    sceneModels[0].tz = ball_pos[2];
    ball_vel = [vx,vy,vz];
    gameStarted = true;
    countHits = 1;
    points = 0;
}

// Reset position when lose
function ball_reset(){
	sceneModels[0].tx = ball_pos[0];
    sceneModels[0].ty = ball_pos[1];
    sceneModels[0].tz = ball_pos[2];
    ball_vel = [0,0,0];
    gameStarted = false;
}

// Update position
function ball_movement() {
    sceneModels[0].tx += ball_vel[0];
    sceneModels[0].ty += ball_vel[1];
    sceneModels[0].tz += ball_vel[2];
    if((countHits % 2 )== 0 ){
        ball_vel[2] *= 1.0008;
    }
}

// Collisions with both ends of tunnel
function ball_limits_detection() {
    if(sceneModels[0].tz < -1.776){
        ball_vel[2] = -ball_vel[2];
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        ball_vel[1] = ball_vel[1]  + (((Math.random() * 0.001) + 0.0001)* plusOrMinus);
        ball_vel[0] = ball_vel[0]  + (((Math.random() * 0.001) + 0.0001)* plusOrMinus);
    }
    if(sceneModels[0].tz > 2.5){
        ball_reset();
    }
}

// Collision with walls
function ball_tunel_collision(){
    if ((sceneModels[0].tx + sceneModels[0].sx )>= sceneModels[3].sx) {
        ball_vel[0]= -ball_vel[0];
    }else if((sceneModels[0].tx - sceneModels[0].sx )<= -sceneModels[3].sx){
        ball_vel[0]= -ball_vel[0];
    }

    if ((sceneModels[0].ty + sceneModels[0].sy )>= sceneModels[3].sx) {
        ball_vel[1]= -ball_vel[1];
    }else if((sceneModels[0].ty - sceneModels[0].sy )<= -sceneModels[3].sx){
        ball_vel[1]= -ball_vel[1];
    }
}

// Collision with panel
function ball_panel_collision() {
    var x;
    var y;

    for (var i = 0; i < 361; i+=30) {
        x = sceneModels[0].tx + sceneModels[0].sx*Math.cos(radians(i))*0.80;
        y = sceneModels[0].ty + sceneModels[0].sy*Math.sin(radians(i))*0.80;
        if (pointInPanel(x,y)) {
            ball_vel[2] = -ball_vel[2];
            countHits++;
            points += Math.round(-1000*ball_vel[2]);
            break;
        }

    }
}

// Check if a specific point of the ball hits the panel
function pointInPanel(x,y) {
	var tz = sceneModels[0].tz + sceneModels[0].sz;
    if (tz >= 1.776 && tz < 1.85) {
        if (x<= (sceneModels[1].tx + panel_size)) {
            if ((x>= (sceneModels[1].tx - panel_size))) {
                if (y<= (sceneModels[1].ty + panel_size)) {
                    if (y>= (sceneModels[1].ty - panel_size)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

//----------------------------------------------------------------------------
//
//  Panel related functions
//

// Limite panel to stay inside canvas
function panel_limits() {
	var maxX = sceneModels[3].sx*canvas.width-43.9;
	var curX = (sceneModels[1].tx)*canvas.width;
	var maxY = sceneModels[3].sy*canvas.height-43.9;
	var curY = (sceneModels[1].ty)*canvas.height;

    if(curY > maxY){
        sceneModels[1].ty = (maxY)/canvas.height;
    }
    else if(curY < -maxY){
        sceneModels[1].ty = -(maxY)/canvas.height;
    }
    if(curX > maxX){
        sceneModels[1].tx = (maxX)/canvas.width;
    }
    else if( curX < -maxX){
        sceneModels[1].tx = -(maxX)/canvas.width;
    }
}

//----------------------------------------------------------------------------
//
//  Timer function
//

function tick() {

	requestAnimFrame(tick);

	mouse = document.getElementById("ctr");
	document.getElementById("score").innerHTML ='Score: ' + points;

	if(mouse.checked == false){
    	handleKeys();
	}

    // Ball movement
    ball_movement();
    ball_limits_detection();
    ball_tunel_collision();
    ball_panel_collision();
    panel_limits();
    shadow_ball();

	drawScene();

	animate();
}


//----------------------------------------------------------------------------
//
//  Handle mouse and keys
//

var currentlyPressedKeys = {};

function handleKeys(){
	if(currentlyPressedKeys[87]){ // W key
        sceneModels[1].ty += panel_vel;
	}
	if(currentlyPressedKeys[65]){ // A key
		sceneModels[1].tx -= panel_vel;
	}
	if(currentlyPressedKeys[68]){ //  D key
		sceneModels[1].tx += panel_vel;
	}
    if(currentlyPressedKeys[83]){ // S key
		sceneModels[1].ty -= panel_vel;
	}

	// Double speed
	if(currentlyPressedKeys[38]){ // UP Arrow
        sceneModels[1].ty += panel_vel*2;		
	}
	if(currentlyPressedKeys[37]){ // LEFT Arrow
        sceneModels[1].tx -= panel_vel*2;		
	}	
	if(currentlyPressedKeys[39]){ // RIGHT Arrow
        sceneModels[1].tx += panel_vel*2;		
	}	
	if(currentlyPressedKeys[40]){ // DOWN Arrow
        sceneModels[1].ty -= panel_vel*2;		
	}
    if(currentlyPressedKeys[82] || currentlyPressedKeys[32]){//RESET (R key or Space bar)
		ball_init((((Math.random() * 0.003) + 0.001)* (Math.random() < 0.5 ? -1 : 1)),(((Math.random() * 0.003) + 0.001)*(Math.random() < 0.5 ? -1 : 1)),-0.03);
	}
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

// Mouse click
function handleMouseDown(){
	mouseDown = true;
	if(mouse.checked){
		ball_init((((Math.random() * 0.003) + 0.001)* (Math.random() < 0.5 ? -1 : 1)),(((Math.random() * 0.003) + 0.001)*(Math.random() < 0.5 ? -1 : 1)),-0.03);
	}
}

// Mouse release
function handleMouseUp(){
	mouseDown = false;
}

// Mouse movement
function handleMouseMove(event) {

	if(mouseDown){
		return;
	}

	if(mouse.checked){
		var rect = canvas.getBoundingClientRect();
		var halfX = canvas.width*0.5;
		var halfY = canvas.height*0.5;
		var mouseX = (((event.clientX - rect.left)-halfX)/halfX)*0.235;
		var mouseY = -(((event.clientY - rect.top)-halfY)/halfY)*0.235;
	  	sceneModels[1].tx = mouseX;
	   	sceneModels[1].ty = mouseY;
	}
}

//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){

}

//----------------------------------------------------------------------------

function setEventListeners(){

    function handleKeyDown(event){
		currentlyPressedKeys[event.keyCode] = true;
		if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        	event.preventDefault();
    	}
	};

	function handleKeyUp(event){
		currentlyPressedKeys[event.keyCode] = false;
	}

    document.onkeydown = handleKeyDown;

	document.onkeyup = handleKeyUp;

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {

		// Create the WebGL context

		// Some browsers still need "experimental-webgl"

		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// DEFAULT: The viewport occupies the whole canvas

		// DEFAULT: The viewport background color is WHITE

		// DEFAULT: Face culling is DISABLED

		// Enable FACE CULLING

		gl.enable( gl.CULL_FACE );

        gl.enable( gl.BLEND);

		// DEFAULT: The BACK FACE is culled!!

		// The next instruction is not needed...

		gl.cullFace( gl.BACK );

		// Enable DEPTH-TEST

		gl.enable( gl.DEPTH_TEST );

	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}
}

//----------------------------------------------------------------------------

function runWebGL() {

	canvas = document.getElementById("my-canvas");

	initWebGL( canvas );

	shaderProgram = initShaders( gl );

	setEventListeners();

	tick();		// A timer controls the rendering / animation

	outputInfos();
}
