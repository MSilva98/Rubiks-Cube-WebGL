//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_27.js 
//
//  Simple mesh data structure
//
//  Adapted from learningwebgl.com
//
//  J. Madeira - November 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null; 

// NEW --- Buffers

var cubeVertexPositionBuffer = null;
	
var cubeVertexColorBuffer = null;

var cubeVertexIndexBuffer = null;

// The global transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 0.25;

var sy = 0.25;

var sz = 0.25;

var globalAngleY = 0.0;
var globalAngleX = 0.0;
var globalTz = 0.0;

// NEW - Animation controls

var rotationXX_ON = 0;

var rotationXX_DIR = 1;

var rotationXX_SPEED = 1;
 
var rotationYY_ON = 0;

var rotationYY_DIR = 1;

var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 0;

var rotationZZ_DIR = 1;

var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 1;
 
// From learningwebgl.com

// NEW --- Storing the vertices defining the cube faces

vertices = [
            // Front face
            -0.95, -0.95,  0.95,
             0.95, -0.95,  0.95,
             0.95,  0.95,  0.95,
            -0.95,  0.95,  0.95,

            // Back face
            -0.95, -0.95, -0.95,
            -0.95,  0.95, -0.95,
             0.95,  0.95, -0.95,
             0.95, -0.95, -0.95,       

            // Top face
            -0.95,  0.95, -0.95,
            -0.95,  0.95,  0.95,
             0.95,  0.95,  0.95,
             0.95,  0.95, -0.95,

            // Bottom face
            -0.95, -0.95, -0.95,
             0.95, -0.95, -0.95,
             0.95, -0.95,  0.95,
            -0.95, -0.95,  0.95,

            // Right face
             0.95, -0.95, -0.95,
             0.95,  0.95, -0.95,
             0.95,  0.95,  0.95,
             0.95, -0.95,  0.95,

            // Left face
            -0.95, -0.95, -0.95,
            -0.95, -0.95,  0.95,
            -0.95,  0.95,  0.95,
            -0.95,  0.95, -0.95
];

// Vertex indices defining the triangles
        
var cubeVertexIndices = [

            0, 1, 2,      0, 2, 3,    // Front face

            4, 5, 6,      4, 6, 7,    // Back face

            8, 9, 10,     8, 10, 11,  // Top face

            12, 13, 14,   12, 14, 15, // Bottom face

            16, 17, 18,   16, 18, 19, // Right face

            20, 21, 22,   20, 22, 23  // Left face
];
         
// And their colour

var colors = [

		 // FRONT FACE - RED
		 	
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,
		 			 
		 // BACK FACE - BLACK
		 	
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,
		 		 
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,
		 			 
		 // TOP FACE - 
		 	
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 			 
		 // BOTTOM FACE
		 	
		 1.00,  0.50,  0.00,
		 
		 1.00,  0.50,  0.00,
		 
		 1.00,  0.50,  0.00,

		 1.00,  0.50,  0.00,

		 			 
		 // RIGHT FACE - BLUE
		 	
		 1.00,  1.00,  1.00,
		
		 1.00,  1.00,  1.00,
		 
		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,
		 			 
		 			 
		 // LEFT FACE - GREEN
		 	
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,

		 1.00,  1.00,  0.00,
];

//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex and the Color Buffers

function initBuffers() {	
	
	// Coordinates
		
	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = vertices.length / 3;			

	// Colors
		
	cubeVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	cubeVertexColorBuffer.itemSize = 3;
	cubeVertexColorBuffer.numItems = vertices.length / 3;			

	// Vertex indices
	
    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers
    	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

	// Drawing the triangles --- NEW --- DRAWING ELEMENTS 
	
	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing with the background color
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// NEW --- Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// TO BE DONE !

		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 10 );
		globalTz = -4;
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Instantianting the same model more than once !!
	
	// And with diferent transformation parameters !!
	
	mvMatrix = mult(mvMatrix,translationMatrix(0,0,globalTz));
	mvMatrix = mult(mvMatrix,rotationYYMatrix(globalAngleX));
	mvMatrix = mult(mvMatrix,rotationXXMatrix(globalAngleY));
	// Call the drawModel function !!
	           	       
	// Instance 2 --- LEFT TOP
	
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx - 0.5, ty + 0.5, tz,
	           mvMatrix,
	           primitiveType );
	           
	// Instance 3 --- LEFT BOTTOM
	
	drawModel( angleXX, angleYY, angleZZ, 
	           sx, sy, sz,
	           tx, ty + 0.5, tz,
	           mvMatrix,
	           primitiveType );
	           	       
	// Instance 4 --- RIGHT BOTTOM
	
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx - 0.5, ty, tz,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx-0.5, ty-0.5, tz,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty+0.5, tz,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty-0.5, tz,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty, tz,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty-0.5, tz,
	           mvMatrix,
	           primitiveType );


	           
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx - 0.5, ty, tz - 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty + 0.5, tz - 0.5,
	           mvMatrix,
	           primitiveType );
	
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx - 0.5, ty + 0.5, tz - 0.5,
	           mvMatrix,
	           primitiveType );
	
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty, tz - 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx-0.5, ty-0.5, tz - 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty+0.5, tz - 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty-0.5, tz - 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty, tz - 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty-0.5, tz - 0.5,
	           mvMatrix,
	           primitiveType );



	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx - 0.5, ty, tz + 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty + 0.5, tz + 0.5,
	           mvMatrix,
	           primitiveType );
	
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx - 0.5, ty + 0.5, tz + 0.5,
	           mvMatrix,
	           primitiveType );
	
	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty, tz + 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx-0.5, ty-0.5, tz + 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty+0.5, tz + 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty-0.5, tz + 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx+0.5, ty, tz + 0.5,
	           mvMatrix,
	           primitiveType );

	drawModel( angleXX, angleYY, angleZZ,  // CW rotations
	           sx, sy, sz,
	           tx, ty-0.5, tz + 0.5,
	           mvMatrix,
	           primitiveType );
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
		
		if( rotationXX_ON ) {

			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationYY_ON ) {

			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationZZ_ON ) {

			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
	    }
	}
	
	lastTime = timeNow;
}

//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com

var currentlyPressedKeys = {};

function handleKeys() {
	
	if (currentlyPressedKeys[33]) {
		
		// Page Up
		
		sx *= 0.9;
		
		sz = sy = sx;
	}
	if (currentlyPressedKeys[34]) {
		
		// Page Down
		
		sx *= 1.1;
		
		sz = sy = sx;
	}
	if (currentlyPressedKeys[37]) {
		
		// Left cursor key
		
		if( rotationYY_ON == 0 ) {
			
			rotationYY_ON = 1;
		}  
		
		rotationYY_SPEED -= 0.25;
	}
	if (currentlyPressedKeys[39]) {
		
		// Right cursor key
		
		if( rotationYY_ON == 0 ) {
			
			rotationYY_ON = 1;
		}  
		
		rotationYY_SPEED += 0.25;
	}
	if (currentlyPressedKeys[38]) {
		
		// Up cursor key
		
		if( rotationXX_ON == 0 ) {
			
			rotationXX_ON = 1;
		}  
		
		rotationXX_SPEED -= 0.25;
	}
	if (currentlyPressedKeys[40]) {
		
		// Down cursor key
		
		if( rotationXX_ON == 0 ) {
			
			rotationXX_ON = 1;
		}  
		
		rotationXX_SPEED += 0.25;
	}
	if (currentlyPressedKeys[90]) {
		
		// Down cursor key
		
		if( rotationZZ_ON == 0 ) {
			
			rotationZZ_ON = 1;
		}  
		
		if (rotationZZ_SPEED >= 0.25){
			rotationZZ_SPEED -= 0.25;
		}
		else{
			rotationZZ_SPEED = 0;
		}

	}
	if (currentlyPressedKeys[88]) {
		
		// Down cursor key
		
		if( rotationZZ_ON == 0 ) {
			
			rotationZZ_ON = 1;
		}  
		
		rotationZZ_SPEED += 0.25;
	}
}

//----------------------------------------------------------------------------

// Handling mouse events

// Adapted from www.learningwebgl.com


var mouseDown = false;

var lastMouseX = null;

var lastMouseY = null;

function handleMouseDown(event) {
	
    mouseDown = true;
  
    lastMouseX = event.clientX;
  
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {

    mouseDown = false;
}

function handleMouseMove(event) {

    if (!mouseDown) {
	  
      return;
    } 
  
    // Rotation angles proportional to cursor displacement
    
    var newX = event.clientX;
  
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    
    globalAngleX += radians( 10 * deltaX  )

    var deltaY = newY - lastMouseY;
    
    globalAngleY += radians( 10 * deltaY  )
    
    lastMouseX = newX
    
    lastMouseY = newY;
  }
//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	// NEW --- Processing keyboard events 
	
	handleKeys();
	
	drawScene();
	
	animate();
}




//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
		
}

//----------------------------------------------------------------------------

function setEventListeners( canvas ){
	
	// NEW ---Handling the mouse
	
	// From learningwebgl.com

    canvas.onmousedown = handleMouseDown;
    
    document.onmouseup = handleMouseUp;
    
    document.onmousemove = handleMouseMove;
    
    // NEW ---Handling the keyboard
	
	// From learningwebgl.com

    function handleKeyDown(event) {
		
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
		
        currentlyPressedKeys[event.keyCode] = false;
    }

	document.onkeydown = handleKeyDown;
    
    document.onkeyup = handleKeyUp;
	

	document.getElementById("reset-button").onclick = function(){
		
		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;

		angleXX = 0.0;

		angleYY = 0.0;

		angleZZ = 0.0;

		sx = 0.25;

		sy = 0.25;

		sz = 0.25;
		
		rotationXX_ON = 0;
		
		rotationXX_DIR = 1;
		
		rotationXX_SPEED = 1;

		rotationYY_ON = 0;
		
		rotationYY_DIR = 1;
		
		rotationYY_SPEED = 1;

		rotationZZ_ON = 0;
		
		rotationZZ_DIR = 1;
		
		rotationZZ_SPEED = 1;
	};      
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
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: The Depth-Buffer is DISABLED
		
		// Enable it !
		
		gl.enable( gl.DEPTH_TEST );
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners( canvas );
	
	initBuffers();
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}


