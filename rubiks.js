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


// To allow choosing the way of drawing the model triangles

var primitiveType = null;

// NEW --- Model Material Features

// Ambient coef.

var kAmbi = [ 0.3, 0.3, 0.3 ];

// Difuse coef.

var kDiff = [ 1.0, 1.0, 1.0 ];

// Specular coef.

var kSpec = [ 1.0, 1.0, 1.0 ];

// Phong coef.

var nPhong = 100.0;

var projectionType = 0; // To allow choosing the projection type

// The global transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

var globalAngleY = 0.0;
var globalAngleX = 0.0;
var globalTz = 0.0;

var angle = 0;

var cubes = [];

var normals = [
		0.0,  0.0,  1.0,
 		0.0,  0.0,  1.0,
 		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,

		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,

		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,

		0.0,  -1.0,  0.0,
		0.0,  -1.0,  0.0,
		0.0,  -1.0,  0.0,
		0.0,  -1.0,  0.0,
		0.0,  -1.0,  0.0,
		0.0,  -1.0,  0.0,

		1.0,   0.0,  0.0,
		1.0,   0.0,  0.0,
		1.0,   0.0,  0.0,
		1.0,   0.0,  0.0,
		1.0,   0.0,  0.0,
		1.0,   0.0,  0.0,

		-1.0,   0.0,  0.0,
		-1.0,   0.0,  0.0,
		-1.0,   0.0,  0.0,
		-1.0,   0.0,  0.0,
		-1.0,   0.0,  0.0,
		-1.0,   0.0,  0.0
];

vertices =[
		-0.95, -0.95, 0.95,
		0.95, 0.95, 0.95,
		-0.95, 0.95, 0.95,
		-0.95, -0.95, 0.95,
		0.95, -0.95, 0.95,
		0.95, 0.95, 0.95,
		0.95, -0.95, 0.95,
		0.95, -0.95, -0.95,
		0.95, 0.95, -0.95,
		0.95, -0.95, 0.95,
		0.95, 0.95, -0.95,
		0.95, 0.95, 0.95,
		-0.95, -0.95, -0.95,
		-0.95, 0.95, -0.95,
		0.95, 0.95, -0.95,
		-0.95, -0.95, -0.95,
		0.95, 0.95, -0.95,
		0.95, -0.95, -0.95,
		-0.95, -0.95, -0.95,
		-0.95, -0.95, 0.95,
		-0.95, 0.95, -0.95,
		-0.95, -0.95, 0.95,
		-0.95, 0.95, 0.95,
		-0.95, 0.95, -0.95,
		-0.95, 0.95, -0.95,
		-0.95, 0.95, 0.95,
		0.95, 0.95, -0.95,
		-0.95, 0.95, 0.95,
		0.95, 0.95, 0.95,
		0.95, 0.95, -0.95,
		-0.95, -0.95, 0.95,
		-0.95, -0.95, -0.95,
		0.95, -0.95, -0.95,
		-0.95, -0.95, 0.95,
		0.95, -0.95, -0.95,
		0.95, -0.95, 0.95,

];

// vertices = [
//             // Front face
//             -0.95, -0.95,  0.95,
//              0.95, -0.95,  0.95,
//              0.95,  0.95,  0.95,
//             -0.95,  0.95,  0.95,
//
//             // Back face
//             -0.95, -0.95, -0.95,
//             -0.95,  0.95, -0.95,
//              0.95,  0.95, -0.95,
//              0.95, -0.95, -0.95,
//
//             // Top face
//             -0.95,  0.95, -0.95,
//             -0.95,  0.95,  0.95,
//              0.95,  0.95,  0.95,
//              0.95,  0.95, -0.95,
//
//             // Bottom face
//             -0.95, -0.95, -0.95,
//              0.95, -0.95, -0.95,
//              0.95, -0.95,  0.95,
//             -0.95, -0.95,  0.95,
//
//             // Right face
//              0.95, -0.95, -0.95,
//              0.95,  0.95, -0.95,
//              0.95,  0.95,  0.95,
//              0.95, -0.95,  0.95,
//
//             // Left face
//             -0.95, -0.95, -0.95,
//             -0.95, -0.95,  0.95,
//             -0.95,  0.95,  0.95,
//             -0.95,  0.95, -0.95
// ];

// Vertex indices defining the triangles

// var cubeVertexIndices = [
//
//             0, 1, 2,      0, 2, 3,    // Front face
//
//             4, 5, 6,      4, 6, 7,    // Back face
//
//             8, 9, 10,     8, 10, 11,  // Top face
//
//             12, 13, 14,   12, 14, 15, // Bottom face
//
//             16, 17, 18,   16, 18, 19, // Right face
//
//             20, 21, 22,   20, 22, 23  // Left face
// ];

// And their colour

var colors = [

		 // FRONT FACE - RED

		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,

		 // BACK FACE - BLACK

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 // TOP FACE -

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,



		 // BOTTOM FACE

		 1.00,  0.50,  0.00,

		 1.00,  0.50,  0.00,

		 1.00,  0.50,  0.00,

		 1.00,  0.50,  0.00,

		 1.00,  0.50,  0.00,

		 1.00,  0.50,  0.00,


		 // RIGHT FACE - BLUE

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,


		 // LEFT FACE - GREEN

		 1.00,  1.00,  0.00,

		 1.00,  1.00,  0.00,

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

	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
			triangleVertexPositionBuffer.itemSize,
			gl.FLOAT, false, 0, 0);

	// Colors

	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
			triangleVertexColorBuffer.itemSize,
			gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Computing the illumination and rendering the model

function computeIllumination( mvMatrix ) {

	// Phong Illumination Model

	// Clearing the colors array

	// for( var i = 0; i < colors.length; i++ )
	// {
	// 	colors[i] = 0.0;
	// }

    // SMOOTH-SHADING

    // Compute the illumination for every vertex

    // Iterate through the vertices

    for( var vertIndex = 0; vertIndex < vertices.length; vertIndex += 3 )
    {
		// For every vertex

		// GET COORDINATES AND NORMAL VECTOR

		var auxP = vertices.slice( vertIndex, vertIndex + 3 );

		var auxN = normals.slice( vertIndex, vertIndex + 3 );

        // CONVERT TO HOMOGENEOUS COORDINATES

		auxP.push( 1.0 );

		auxN.push( 0.0 );

        // APPLY CURRENT TRANSFORMATION

        var pointP = multiplyPointByMatrix( mvMatrix, auxP );

        var vectorN = multiplyVectorByMatrix( mvMatrix, auxN );

        normalize( vectorN );

		// VIEWER POSITION

		var vectorV = vec3();

		if( projectionType == 0 ) {

			// Orthogonal

			vectorV[2] = 1.0;
		}
		else {

		    // Perspective

		    // Viewer at ( 0, 0 , 0 )

			vectorV = symmetric( pointP );
		}

        normalize( vectorV );

	    // Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR

	    // FOR EACH LIGHT SOURCE

	    for(var l = 0; l < lightSources.length; l++ )
	    {
			if( lightSources[l].isOff() ) {

				continue;
			}

	        // INITIALIZE EACH COMPONENT, with the constant terms

		    var ambientTerm = vec3();

		    var diffuseTerm = vec3();

		    var specularTerm = vec3();

		    // For the current light source

		    ambient_Illumination = lightSources[l].getAmbIntensity();

		    int_Light_Source = lightSources[l].getIntensity();

		    pos_Light_Source = lightSources[l].getPosition();

		    // Animating the light source, if defined

		    var lightSourceMatrix = mat4();

		    // COMPLETE THE CODE FOR THE OTHER ROTATION AXES

		    if( lightSources[l].isRotYYOn() )
		    {
				lightSourceMatrix = mult(
						lightSourceMatrix,
						rotationYYMatrix( lightSources[l].getRotAngleYY() ) );
			}

	        for( var i = 0; i < 3; i++ )
	        {
			    // AMBIENT ILLUMINATION --- Constant for every vertex

			    ambientTerm[i] = ambient_Illumination[i] * kAmbi[i];

	            diffuseTerm[i] = int_Light_Source[i] * kDiff[i];

	            specularTerm[i] = int_Light_Source[i] * kSpec[i];
	        }

	        // DIFFUSE ILLUMINATION

	        var vectorL = vec4();

	        if( pos_Light_Source[3] == 0.0 )
	        {
	            // DIRECTIONAL Light Source

	            vectorL = multiplyVectorByMatrix(
							lightSourceMatrix,
							pos_Light_Source );
	        }
	        else
	        {
	            // POINT Light Source

	            // TO DO : apply the global transformation to the light source?

	            vectorL = multiplyPointByMatrix(
							lightSourceMatrix,
							pos_Light_Source );

				for( var i = 0; i < 3; i++ )
	            {
	                vectorL[ i ] -= pointP[ i ];
	            }
	        }

			// Back to Euclidean coordinates

			vectorL = vectorL.slice(0,3);

	        normalize( vectorL );

	        var cosNL = dotProduct( vectorN, vectorL );

	        if( cosNL < 0.0 )
	        {
				// No direct illumination !!

				cosNL = 0.0;
	        }

	        // SEPCULAR ILLUMINATION

	        var vectorH = add( vectorL, vectorV );

	        normalize( vectorH );

	        var cosNH = dotProduct( vectorN, vectorH );

			// No direct illumination or viewer not in the right direction

	        if( (cosNH < 0.0) || (cosNL <= 0.0) )
	        {
	            cosNH = 0.0;
	        }

	        // // Compute the color values and store in the colors array
			//
	        // var tempR = ambientTerm[0] + diffuseTerm[0] * cosNL + specularTerm[0] * Math.pow(cosNH, nPhong);
			//
	        // var tempG = ambientTerm[1] + diffuseTerm[1] * cosNL + specularTerm[1] * Math.pow(cosNH, nPhong);
			//
	        // var tempB = ambientTerm[2] + diffuseTerm[2] * cosNL + specularTerm[2] * Math.pow(cosNH, nPhong);
			//
			// colors[vertIndex] += tempR;
			//
	        // // Avoid exceeding 1.0
			//
			// if( colors[vertIndex] > 1.0 ) {
			//
			// 	colors[vertIndex] = 1.0;
			// }
			//
	        // // Avoid exceeding 1.0
			//
			// colors[vertIndex + 1] += tempG;
			//
			// if( colors[vertIndex + 1] > 1.0 ) {
			//
			// 	colors[vertIndex + 1] = 1.0;
			// }
			//
			// colors[vertIndex + 2] += tempB;
			//
	        // // Avoid exceeding 1.0
			//
			// if( colors[vertIndex + 2] > 1.0 ) {
			//
			// 	colors[vertIndex + 2] = 1.0;
			// }
	    }
	}
}



//----------------------------------------------------------------------------

//  Drawing the model

var angle = 90;

var rotateXX = false;

function drawModel(	tx, ty, tz,
					mvMatrix, rotateXX) {

    // Pay attention to transformation order !!
    if(rotateXX == true){
    	mvMatrix = mult( mvMatrix, rotationXXMatrix(angle));
    }

    mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( 0.25, 0.25, 0.25 ) );

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// NEW - Aux. Function for computing the illumination

	computeIllumination( mvMatrix );

	initBuffers();

	// Drawing

	// primitiveType allows drawing as filled triangles / wireframe / vertices

	gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


    // Passing the buffers

	// gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	//
    // gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//
	// gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	//
    // gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	//
	// // Drawing the triangles --- NEW --- DRAWING ELEMENTS
	//
	// gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

	var pMatrix;

	var mvMatrix = mat4();



	// Clearing with the background color

	gl.clear(gl.COLOR_BUFFER_BIT);

	pMatrix = perspective( 45, 1, 0.05, 10 );
	globalTz = -4;

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// NEW --- Instantianting the same model more than once !!

	// And with diferent transformation parameters !!

	mvMatrix = mult(mvMatrix,translationMatrix(0,0,globalTz));
	mvMatrix = mult(mvMatrix,rotationYYMatrix(globalAngleX));
	mvMatrix = mult(mvMatrix,rotationXXMatrix(globalAngleY));
	// Call the drawModel function !!

	// Middle cubes
	drawModel( tx - 0.5, ty + 0.5, tz,
	           mvMatrix, false);

	drawModel( tx, ty + 0.5, tz,
	           mvMatrix, true);

	drawModel( tx - 0.5, ty, tz,
	           mvMatrix, false);

	drawModel( tx-0.5, ty-0.5, tz,
	           mvMatrix, false);

	drawModel( tx+0.5, ty+0.5, tz,
	           mvMatrix, false);

	drawModel( tx+0.5, ty-0.5, tz,
	           mvMatrix, false);

	drawModel( tx+0.5, ty, tz,
	           mvMatrix, false);

	drawModel( tx, ty-0.5, tz,
	           mvMatrix, true);

	// Back cubes

	drawModel( tx - 0.5, ty, tz - 0.5,
	           mvMatrix, false);

	drawModel( tx, ty + 0.5, tz - 0.5,
	           mvMatrix, true);

	drawModel( tx - 0.5, ty + 0.5, tz - 0.5,
	           mvMatrix, false);

	drawModel( tx, ty, tz - 0.5,
	           mvMatrix, true);

	drawModel( tx-0.5, ty-0.5, tz - 0.5,
	           mvMatrix, false);

	drawModel( tx+0.5, ty+0.5, tz - 0.5,
	           mvMatrix, false);

	drawModel( tx+0.5, ty-0.5, tz - 0.5,
	           mvMatrix, false);

	drawModel( tx+0.5, ty, tz - 0.5,
	           mvMatrix, false);

	drawModel( tx, ty-0.5, tz - 0.5,
	           mvMatrix, true);

	// Front cubes

	drawModel( tx - 0.5, ty, tz + 0.5,
	           mvMatrix, false);

	drawModel( tx, ty + 0.5, tz + 0.5,
	           mvMatrix, true);

	drawModel( tx - 0.5, ty + 0.5, tz + 0.5,
	           mvMatrix, false);

	drawModel( tx, ty, tz + 0.5,
	           mvMatrix, true);

	drawModel( tx-0.5, ty-0.5, tz + 0.5,
	           mvMatrix, false);

	drawModel( tx+0.5, ty+0.5, tz + 0.5,
	           mvMatrix, false);

	drawModel( tx+0.5, ty-0.5, tz + 0.5,
	           mvMatrix, false);

	drawModel( tx+0.5, ty, tz + 0.5,
	           mvMatrix, false);

	drawModel( tx, ty-0.5, tz + 0.5,
	           mvMatrix, true);
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

    document.getElementById("rot").onclick = function(){
    	rotateXX = true;
    };

	document.getElementById("reset-button").onclick = function(){

		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;
	};
}

var lastTime = 0;

function animate() {

	var timeNow = new Date().getTime();

	if( lastTime != 0 ) {

		var elapsed = timeNow - lastTime;

		if( rotateXX ) {

			angle += parseInt(1 * (90 * elapsed) / 1000.0);
			if(angle%90 == 0){
				rotateXX = false;
			}
	    }
	}

	lastTime = timeNow;
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
