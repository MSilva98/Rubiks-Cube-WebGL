//////////////////////////////////////////////////////////////////////////////
//
//  Rubicls-cube.js
//
//  Adapted from an exercise of one class
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;


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
var globalAngleX = 0.0;
var globalAngleY = 0.0;
var globalAngleZ = 0.0;
var globalXDir = 1;
var globalYDir = 1;
var globalZDir = 1;
var globalTz = 0.0;

// Each face can be at different angles
var angleXl = 0;
var angleXm = 0;
var angleXr = 0; 

var angleYl = 0;
var angleYm = 0;
var angleYr = 0; 

var angleZl = 0;
var angleZm = 0;
var angleZr = 0; 

var rotateXX_mid = false;
var rotateXX_left = false;
var rotateXX_right = false;
var XX_DIR = 1;

var rotateYY_mid = false;
var rotateYY_left = false;
var rotateYY_right = false;
var YY_DIR = 1;

var rotateZZ_mid = false;
var rotateZZ_left = false;
var rotateZZ_right = false;
var ZZ_DIR = 1;

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

		 // RIGHT FACE - BLUE
		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 0.00,  0.00,  1.00,

		 // BACK FACE - ORANGE
		 1.00,  0.40,  0.00,

		 1.00,  0.40,  0.00,

		 1.00,  0.40,  0.00,

		 1.00,  0.40,  0.00,

		 1.00,  0.40,  0.00,

		 1.00,  0.40,  0.00,

		 // LEFT FACE - GREEN
		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 0.00,  1.00,  0.00,

		 // TOP FACE - WHITE
		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 1.00,  1.00,  1.00,

		 // BOTTOM FACE - YELLOW
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

// //  Drawing the model
// function drawModel(mvMatrix, tx, ty, tz) {
    
//     // mvMatrix = computeRotations(tx,ty,tz,mvMatrix);

// 	// mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
// 	// for (var i = 0; i < cubes.length; i++) {
// 		mvMatrix = computeRotations(mvMatrix, tx, ty, tz);

// 		// mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

// 	    mvMatrix = mult( mvMatrix, scalingMatrix( 0.25, 0.25, 0.25 ) );

// 		// Passing the Model View Matrix to apply the current transformation

// 		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

// 		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

// 		// NEW - Aux. Function for computing the illumination

// 		computeIllumination( mvMatrix );

// 		initBuffers();

// 		// Drawing

// 		// primitiveType allows drawing as filled triangles / wireframe / vertices

// 		gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
// 	// }
// }

//----------------------------------------------------------------------------

//  Drawing the 3D scene

var cubes = [];

function fillCubesArray(){
	var mvMatrix = mat4();
	globalTz = -4;
	mvMatrix = mult(mvMatrix,translationMatrix(0,0,globalTz));
	var c = 0;
	for(var x = -0.5; x <= 0.5; x += 0.5){
		for(var y = -0.5; y <= 0.5; y += 0.5){
			for(var z = -0.5; z <= 0.5; z += 0.5){	
				cubes[c] = new Cube(mvMatrix, x,y,z);
				c++;
			} 	
		} 		
	}
}

function drawScene() {

	var pMatrix;
	
	// Clearing with the background color

	gl.clear(gl.COLOR_BUFFER_BIT);

	pMatrix = perspective( 45, 1, 0.05, 10 );

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// NEW --- Instantianting the same model more than once !!

	// And with diferent transformation parameters !!
	// mvMatrix = mult(mvMatrix,translationMatrix(0,0,globalTz));
	
	fillCubesArray();
	// compute rotation HERE!!! (new function tbh)
	
	// cubes[2].rotationX(angleXl);
	// cubes[2].rotationY(angleYl);

	// Call the drawModel function !!
	for(var i = 0; i < cubes.length; i++){
		cubes[i].computeAllRot();
		cubes[i].drawModel(); 		
	}

}

function rotation2D(angle, t1, t2){
	var rotated1;
	var rotated2;
	rotated1 = t1*Math.cos(radians(angle))-t2*Math.sin(radians(angle));
	rotated2 = t1*Math.sin(radians(angle))+t2*Math.cos(radians(angle));
	return [rotated1, rotated2];
}

// compute rotations
function computeRotations(){
	// // Rotations around XX
	// // Left Face
	// if(tx == -0.5 && angleXl){
	// 	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXl));	
		
	// 	if(angleXl%90 == 0){
	// 		var temp = rotation2D(angleXl, ty, tz);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(tx,temp[0],temp[1]));
	// 	}
	// }
	// // Middle Face
	// else if(tx == 0.0 && angleXm){
	// 	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXm));

	// 	if(angleXm%90 == 0){
	// 		var temp = rotation2D(angleXm, ty, tz);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(tx,temp[0],temp[1]));
	// 	}
	// }
	// // Right Face
	// else if(tx == 0.5 && angleXr){
	// 	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXr));

	// 	if(angleXr%90 == 0){
	// 		var temp = rotation2D(angleXr, ty, tz);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(tx,temp[0],temp[1]));
	// 	}
	// }

	// // Rotations around YY
	// // Top Face
	// if(ty == 0.5){
	// 	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYl));

	// 	if(angleYl%90 == 0){
	// 		var temp = rotation2D(angleYl, tx, tz);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(temp[0],ty,temp[1]));
	// 	}
	// }
	// // Middle Face
	// if(ty == 0.0){
	// 	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYm));

	// 	if(angleYm%90 == 0){
	// 		var temp = rotation2D(angleYm, tx, tz);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(temp[0],ty,temp[1]));
	// 	}
	// }
	// // Bottom Face
	// if(ty == -0.5){
	// 	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYr));

	// 	if(angleYr%90 == 0){
	// 		var temp = rotation2D(angleYr, ty, tz);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(temp[0],ty,temp[1]));
	// 	}
	// }

	// // Rotations around ZZ
	// // Back Face
	// if(tz == -0.5){
	// 	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZl));

	// 	if(angleZl%90 == 0){
	// 		var temp = rotation2D(angleZl, tx, ty);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(temp[0],temp[1],tz));
	// 	}
	// }
	// // Middle Face
	// if(tz == 0.0){
	// 	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZm));

	// 	if(angleZm%90 == 0){
	// 		var temp = rotation2D(angleZm, tx, ty);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(temp[0],temp[1],tz));
	// 	}
	// }
	// // Front Face
	// if(tz == 0.5){
	// 	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZr));

	// 	if(angleZr%90 == 0){
	// 		var temp = rotation2D(angleZr, tx, ty);
	// 		mvMatrix = mult(mvMatrix, translationMatrix(temp[0],temp[1],tz));
	// 	}
	// }
	// return mvMatrix;
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

    // globalAngleX += radians( 10 * deltaX  )

    var deltaY = newY - lastMouseY;

    // globalAngleY += radians( 10 * deltaY  )

    lastMouseX = newX

    lastMouseY = newY;
}


//----------------------------------------------------------------------------

// Timer

function tick() {

	requestAnimFrame(tick);

	handleKeys();

	drawScene();

	animate();

}

var currentlyPressedKeys = {};

function handleKeys(){
	if(currentlyPressedKeys[16]){
		if(currentlyPressedKeys[88]){
			globalXDir = -1;
		}

		if(currentlyPressedKeys[89]){
			globalYDir = -1;
		}

		if(currentlyPressedKeys[90]){
			globalZDir = -1;
		}
	}
	else{
		if(currentlyPressedKeys[88]){
			globalXDir = 1;
		}

		if(currentlyPressedKeys[89]){
			globalYDir = 1;
		}

		if(currentlyPressedKeys[90]){
			globalZDir = 1;
		}	
	}
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

	function handleKeyDown(event){
		currentlyPressedKeys[event.keyCode] = true;
	};

	function handleKeyUp(event){
		currentlyPressedKeys[event.keyCode] = false;
	}

	document.onkeydown = handleKeyDown;

	document.onkeyup = handleKeyUp;
    
    // XX Positive rotations
    document.getElementById("rotXXleft+").onclick = function(){
    	rotateXX_left = true;
    	XX_DIR = 1;
    };
    document.getElementById("rotXXright+").onclick = function(){
    	rotateXX_right = true;
    	XX_DIR = 1;
    };
    document.getElementById("rotXXmid+").onclick = function(){
    	rotateXX_mid = true;
    	XX_DIR = 1;
    };

    // XX Negative Rotation
    document.getElementById("rotXXleft-").onclick = function(){
    	rotateXX_left = true;
    	XX_DIR = -1;
    };
    document.getElementById("rotXXright-").onclick = function(){
    	rotateXX_right = true;
    	XX_DIR = -1;
    };
    document.getElementById("rotXXmid-").onclick = function(){
    	rotateXX_mid = true;
    	XX_DIR = -1;
    };


    // YY Positive Rotations
    document.getElementById("rotYYleft+").onclick = function(){
    	rotateYY_left = true;
    	YY_DIR = 1;
    };
    document.getElementById("rotYYright+").onclick = function(){
    	rotateYY_right = true;
    	YY_DIR = 1;
    };
    document.getElementById("rotYYmid+").onclick = function(){
    	rotateYY_mid = true;
    	YY_DIR = 1;
    };

    // YY Negative Rotations
    document.getElementById("rotYYleft-").onclick = function(){
    	rotateYY_left = true;
    	YY_DIR = -1;
    };
    document.getElementById("rotYYright-").onclick = function(){
    	rotateYY_right = true;
    	YY_DIR = -1;
    };
    document.getElementById("rotYYmid-").onclick = function(){
    	rotateYY_mid = true;
    	YY_DIR = -1;
    };


    // ZZ Positive Rotations
    document.getElementById("rotZZleft+").onclick = function(){
    	rotateZZ_left = true;
    	ZZ_DIR = 1;
    };
    document.getElementById("rotZZright+").onclick = function(){
    	rotateZZ_right = true;
    	ZZ_DIR = 1;
    };
    document.getElementById("rotZZmid+").onclick = function(){
    	rotateZZ_mid = true;
    	ZZ_DIR = 1;
    };

    // YY Negative Rotations
    document.getElementById("rotZZleft-").onclick = function(){
    	rotateZZ_left = true;
    	ZZ_DIR = -1;
    };
    document.getElementById("rotZZright-").onclick = function(){
    	rotateZZ_right = true;
    	ZZ_DIR = -1;
    };
    document.getElementById("rotZZmid-").onclick = function(){
    	rotateZZ_mid = true;
    	ZZ_DIR = -1;
    };


	document.getElementById("reset-button").onclick = function(){

		// The initial values
		angleXl = 9;
		angleXm = 0;
		angleXr = 0;

		angleYl = 0;
		angleYm = 0;
		angleYr = 0;

		angleZl = 0;
		angleZm = 0;
		anlgeZr = 0;

		globalAngleX = 0;
		globalAngleY = 0;
		globalAngleZ = 0;
	};
}

var lastTime = 0;

function animate() {

	var timeNow = new Date().getTime();

	if( lastTime != 0 ) {

		var elapsed = timeNow - lastTime;
			
		// XX Rotations
		if(rotateXX_left) {
			angleXl += Math.round(XX_DIR * (90 * elapsed) / 1700.0);
			if(angleXl%90 == 0){
				rotateXX_left = false;
			}
			if(angleXl == 360){
				angleXl = 0;
			}
	    }
	    if(rotateXX_mid) {
			angleXm += Math.round(XX_DIR * (90 * elapsed) / 1700.0);
			if(angleXm%90 == 0){
				rotateXX_mid = false;
			}
			if(angleXm == 360){
				angleXm = 0;
			}
	    }
	    if(rotateXX_right) {
			angleXr += Math.round(XX_DIR * (90 * elapsed) / 1700.0);
			if(angleXr%90 == 0){
				rotateXX_right = false;
			}
			if(angleXr == 360){
				angleXr = 0;
			}
	    }

	    // YY Rotations
	    if(rotateYY_left) {
			angleYl += Math.round(YY_DIR * (90 * elapsed) / 1700.0);
			if(angleYl%90 == 0){
				rotateYY_left = false;
			}
			if(angleYl == 360){
				angleYl = 0;
			}
	    }
	    if(rotateYY_mid) {
			angleYm += Math.round(YY_DIR * (90 * elapsed) / 1700.0);
			if(angleYm%90 == 0){
				rotateYY_mid = false;
			}
			if(angleYm == 360){
				angleYm = 0;
			}
	    }
	    if(rotateYY_right) {
			angleYr += Math.round(YY_DIR * (90 * elapsed) / 1700.0);
			if(angleYr%90 == 0){
				rotateYY_right = false;
			}
			if(angleYm == 360){
				angleYm = 0;
			}
	    }

	    // ZZ Rotations
	    if(rotateZZ_left) {
			angleZl += Math.round(ZZ_DIR * (90 * elapsed) / 1700.0);
			if(angleZl%90 == 0){
				rotateZZ_left = false;
			}
			if(angleZl == 360){
				angleZl = 0;
			}
	    }
	    if(rotateZZ_mid) {
			angleZm += Math.round(ZZ_DIR * (90 * elapsed) / 1700.0);
			if(angleZm%90 == 0){
				rotateZZ_mid = false;
			}
			if(angleZm == 360){
				angleZm = 0;
			}
	    }
	    if(rotateZZ_right) {
			angleZr += Math.round(ZZ_DIR * (90 * elapsed) / 1700.0);
			if(angleZr%90 == 0){
				rotateZZ_right = false;
			}
			if(angleZr == 360){
				angleZr = 0;
			}
	    }

	    if (currentlyPressedKeys[88]) {
			// X key pressed
			globalAngleX += Math.round(globalXDir * (90 * elapsed) / 1000.0);
		}
		if (currentlyPressedKeys[89]) {
			// Y key pressed
			globalAngleY += Math.round(globalYDir * (90 * elapsed) / 1000.0);
		}
		if (currentlyPressedKeys[90]) {
			// Z key pressed
			globalAngleZ += Math.round(globalZDir * (90 * elapsed) / 1000.0);
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
