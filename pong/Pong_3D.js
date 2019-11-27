//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_24_GPU_per_vertex.js
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
// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// To allow choosing the projection type

var projectionType = 1;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];

//Ball

var ball_pos = [ 0.0,0.0,0.0];
var ball_vel = [ 0.0,0.0,0.0];

//Panel

var panel_pos = [ 0.0,0.0,0.0];
var panel_vel = 0.005;
var panel_size = 0.045;


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


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

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
					mvMatrix ) {

	// The the global model transformation is an input

	// Concatenate with the particular model transformations

    // Pay attention to transformation order !!

	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );

	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );

	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );

	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );

	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Associating the data to the vertex shader

	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors

	initBuffers(model);

    //BLENDING
    if (model.blend) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        var alpha = 0.5;

        gl.uniform1f(shaderProgram.alphaUniform, alpha);
    }


	// Material properties

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

	//Light Sources

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
		gl.drawArrays(gl.TRIANGLE_FAN, 0, triangleVertexPositionBuffer.numItems);
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

		// Viewer is at (0,0,0)

		// Ensure that the model is "inside" the view volume

		pMatrix = perspective( 45, 1, 0.05, 15 );

		// Global transformation !!

		globalTz = -2.5;

		// NEW --- The viewer is on (0,0,0)

		// pos_Viewer[0] = 0.0;
        // pos_Viewer[1] = 0.0;
        // pos_Viewer[2] = 0.0;
		// pos_Viewer[3] = 1.0;
        pos_Viewer[0] = 0.0;
        pos_Viewer[1] = 0.0;
        pos_Viewer[2] = 0.0;
		pos_Viewer[3] = 1.0;

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// NEW --- Passing the viewer position to the vertex shader

	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE

	mvMatrix = translationMatrix( 0, 0, globalTz );

	// NEW - Updating the position of the light sources, if required

	// FOR EACH LIGHT SOURCE

	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined

		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {

			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() )
			{
				lightSourceMatrix = mult(
						lightSourceMatrix,
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}

            if( lightSources[i].isRotZZOn() )
			{
				lightSourceMatrix = mult(
						lightSourceMatrix,
						rotationZZMatrix( lightSources[i].getRotAngleZZ() ) );
			}
		}

		// NEW Passing the Light Souree Matrix to apply

		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");

		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}

	// Instantianting all scene models

	for(var i = 0; i < sceneModels.length; i++ )
	{
		drawModel( sceneModels[i],
			   mvMatrix);
	}
	// NEW - Counting the frames

	countFrames();
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {

	var timeNow = new Date().getTime();

	if( lastTime != 0 ) {

		var elapsed = timeNow - lastTime;

		// Global rotation

		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// For every model --- Local rotations

		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}
		}

		// Rotating the light sources

		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

				lightSources[i].setRotAngleYY( angle );
			}
		}

        for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotZZOn() ) {

				var angle = lightSources[i].getRotAngleZZ() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

				lightSources[i].setRotAngleZZ( angle );
			}
		}
	}

	lastTime = timeNow;
}


//Shadow ball

function shadow_ball(){
    sceneModels[3].tx = sceneModels[1].tx;
    sceneModels[3].tz = sceneModels[1].tz;
    sceneModels[3].sx = sceneModels[3].sz = sceneModels[3].sy;
    sceneModels[3].sx = sceneModels[1].ty*0.1 +sceneModels[3].sy;
    sceneModels[3].sz = sceneModels[3].sx;
}

//Ball

function ball_init(vx,vy,vz) {
    sceneModels[1].tx = ball_pos[0];
    sceneModels[1].ty = ball_pos[1];
    sceneModels[1].tz = ball_pos[2];
    ball_vel[0] = vx;
    ball_vel[1] = vy;
    ball_vel[2] = vz;
    countHits = 1;
    points = 0;
}

function ball_movement() {
    sceneModels[1].tx += ball_vel[0];
    sceneModels[1].ty += ball_vel[1];
    sceneModels[1].tz += ball_vel[2];
    if((countHits % 2 )== 0 ){
        ball_vel[2] *= 1.001;
    }
}

function ball_limits_detection() {
    if(sceneModels[1].tz <= -1.776){
        ball_vel[2] = -ball_vel[2];
    }
    if(sceneModels[1].tz > 1.8){
        console.log(points);
        ball_init(0,0,0);
    }
}

function ball_tunel_collision(){
    if ((sceneModels[1].tx + sceneModels[1].sx )>= sceneModels[0].sx) {
        ball_vel[0]= -ball_vel[0];
    }else if((sceneModels[1].tx - sceneModels[1].sx )<= -sceneModels[0].sx){
        ball_vel[0]= -ball_vel[0];
    }

    if ((sceneModels[1].ty + sceneModels[1].sy )>= sceneModels[0].sx) {
        ball_vel[1]= -ball_vel[1];
    }else if((sceneModels[1].ty - sceneModels[1].sy )<= -sceneModels[0].sx){
        ball_vel[1]= -ball_vel[1];
    }
}

function ball_panel_collision() {
    var x;
    var y;

    for (var i = 0; i < 361; i+=30) {
        x = sceneModels[1].tx + sceneModels[1].sx*Math.cos(radians(i))*0.80;
        y = sceneModels[1].ty + sceneModels[1].sy*Math.sin(radians(i))*0.80;
        if (pointInPanel(x,y)) {
            ball_vel[2] = -ball_vel[2];
            countHits++;
            break;
        }

    }
}

function pointInPanel(x,y) {
    if (sceneModels[1].tz + sceneModels[1].sz >= 1.776) {
        if (x<= (sceneModels[2].tx + panel_size)) {
            if ((x>= (sceneModels[2].tx - panel_size))) {
                if (y<= (sceneModels[2].ty + panel_size)) {
                    if (y>= (sceneModels[2].ty - panel_size)) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

//panel
function panel_limits() {
	var maxX = sceneModels[0].sx*canvas.width-43.9;
	var curX = (sceneModels[2].tx)*canvas.width;
	var maxY = sceneModels[0].sy*canvas.height-43.9;
	var curY = (sceneModels[2].ty)*canvas.height;

    if(curY > maxY){
        sceneModels[2].ty = (maxY)/canvas.height;
    }
    else if(curY < -maxY){
        sceneModels[2].ty = -(maxY)/canvas.height;
    }
    if(curX > maxX){
        sceneModels[2].tx = (maxX)/canvas.width;
    }
    else if( curX < -maxX){
        sceneModels[2].tx = -(maxX)/canvas.width;
    }
}

//----------------------------------------------------------------------------

// Timer

function tick() {

	requestAnimFrame(tick);

    handleKeys();

    //Ball movement
    ball_movement();
    ball_limits_detection();
    ball_tunel_collision();
    ball_panel_collision();
    panel_limits();
    shadow_ball();
    points++;

	drawScene();

	animate();
}




var currentlyPressedKeys = {};

function handleKeys(){
		if(currentlyPressedKeys[87]){ //UP W
            sceneModels[2].ty += panel_vel;
		}

		if(currentlyPressedKeys[65]){ //LEFT A
			sceneModels[2].tx -= panel_vel;
		}

		if(currentlyPressedKeys[68]){//RIGHT D
			sceneModels[2].tx += panel_vel;
		}

        if(currentlyPressedKeys[83]){//DOWN S
			sceneModels[2].ty -= panel_vel;
		}

        if(currentlyPressedKeys[82]){//RESET R
			ball_init(0.002,0.003,-0.03);
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
	};

	function handleKeyUp(event){
		currentlyPressedKeys[event.keyCode] = false;
	}

    document.onkeydown = handleKeyDown;

	document.onkeyup = handleKeyUp;
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
