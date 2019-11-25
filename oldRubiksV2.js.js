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

var kAmbi = [ 0.2, 0.2, 0.2 ];

// Difuse coef.

var kDiff = [ 0.2, 0.2, 0.2 ];

// Specular coef.

var kSpec = [ 0.2, 0.2, 0.2 ];

// Phong coef.

var nPhong = 100.0;

var projectionType = 1; // To allow choosing the projection type

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

var colors2 = [];


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

	for( var i = 0; i < colors.length; i++ )
	{
		colors[i] = colors2[i];
	}

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

	        // Compute the color values and store in the colors array

	        var tempR = ambientTerm[0] + diffuseTerm[0] * cosNL + specularTerm[0] * Math.pow(cosNH, nPhong);

	        var tempG = ambientTerm[1] + diffuseTerm[1] * cosNL + specularTerm[1] * Math.pow(cosNH, nPhong);

	        var tempB = ambientTerm[2] + diffuseTerm[2] * cosNL + specularTerm[2] * Math.pow(cosNH, nPhong);

			colors[vertIndex] += tempR;

	        // Avoid exceeding 1.0

			if( colors[vertIndex] > 1.0 ) {

				colors[vertIndex] = 1.0;
			}

	        // Avoid exceeding 1.0

			colors[vertIndex + 1] += tempG;

			if( colors[vertIndex + 1] > 1.0 ) {

				colors[vertIndex + 1] = 1.0;
			}

			colors[vertIndex + 2] += tempB;

	        // Avoid exceeding 1.0

			if( colors[vertIndex + 2] > 1.0 ) {

				colors[vertIndex + 2] = 1.0;
			}
	    }
	}
}


//  Drawing the 3D scene

var cubes = [];
var leftFace = {};
var rightFace = {};
var topFace = {};
var bottomFace = {};
var frontFace = {};
var backFace = {};

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

function fillFaces(){
	fillCubesArray();
	// var l = r = f = b = t = bF = 0;
	// leftFace[l] = Object(cubes[0]);
	// for (var i = 0; i < cubes.length; i++) {
		// if(cubes[0].x == -0.5 && Object.keys(leftFace).length < 9){
		// 	leftFace[l] = Object(cubes[0]);
		// 	l++;
		// }
		leftFace[0] = Object(cubes[0]);
		leftFace[1] = Object(cubes[1]);
		leftFace[2] = Object(cubes[2]);
		leftFace[3] = Object(cubes[3]);
		leftFace[4] = Object(cubes[4]);
		leftFace[5] = Object(cubes[5]);
		leftFace[6] = Object(cubes[6]);
		leftFace[7] = Object(cubes[7]);
		leftFace[8] = Object(cubes[8]);

		rightFace[0] = Object(cubes[18]);
		rightFace[1] = Object(cubes[19]);
		rightFace[2] = Object(cubes[20]);
		rightFace[3] = Object(cubes[21]);
		rightFace[4] = Object(cubes[22]);
		rightFace[5] = Object(cubes[23]);
		rightFace[6] = Object(cubes[24]);
		rightFace[7] = Object(cubes[25]);
		rightFace[8] = Object(cubes[26]);

		topFace[0] = Object(cubes[6]);
		topFace[1] = Object(cubes[7]);
		topFace[2] = Object(cubes[8]);
		topFace[3] = Object(cubes[15]);
		topFace[4] = Object(cubes[16]);
		topFace[5] = Object(cubes[17]);
		topFace[6] = Object(cubes[24]);
		topFace[7] = Object(cubes[25]);
		topFace[8] = Object(cubes[26]);

		bottomFace[0] = Object(cubes[0]);
		bottomFace[1] = Object(cubes[1]);
		bottomFace[2] = Object(cubes[2]);
		bottomFace[3] = Object(cubes[9]);
		bottomFace[4] = Object(cubes[10]);
		bottomFace[5] = Object(cubes[11]);
		bottomFace[6] = Object(cubes[18]);
		bottomFace[7] = Object(cubes[19]);
		bottomFace[8] = Object(cubes[20]);

		backFace[0] = Object(cubes[0]);
		backFace[1] = Object(cubes[3]);
		backFace[2] = Object(cubes[6]);
		backFace[3] = Object(cubes[9]);
		backFace[4] = Object(cubes[12]);
		backFace[5] = Object(cubes[15]);
		backFace[6] = Object(cubes[18]);
		backFace[7] = Object(cubes[21]);
		backFace[8] = Object(cubes[24]);

		frontFace[0] = Object(cubes[2]);
		frontFace[1] = Object(cubes[5]);
		frontFace[2] = Object(cubes[8]);
		frontFace[3] = Object(cubes[11]);
		frontFace[4] = Object(cubes[14]);
		frontFace[5] = Object(cubes[17]);
		frontFace[6] = Object(cubes[20]);
		frontFace[7] = Object(cubes[23]);
		frontFace[8] = Object(cubes[26]);

		// if(cubes[i].x == 0.5 && Object.keys(rightFace).length < 9){
		// 	rightFace[r] = Object(cubes[i]);
		// 	r++;
		// }
		// if(cubes[i].y == -0.5 && Object.keys(bottomFace).length < 9){
		// 	bottomFace[b] = Object(cubes[i]);
		// 	b++;
		// }
		// if(cubes[i].y == 0.5 && Object.keys(topFace).length < 9){
		// 	topFace[t] = Object(cubes[i]);
		// 	t++;
		// }
		// if(cubes[i].z == -0.5 && Object.keys(backFace).length < 9){
		// 	backFace[bF] = Object(cubes[i]);
		// 	bF++;
		// }
		// if(cubes[i].z == 0.5 && Object.keys(frontFace).length < 9){
		// 	frontFace[f] = Object(cubes[i]);
		// 	f++;
		// }
	// }
}

function drawScene() {

	var pMatrix;
	
	// Clearing with the background color

	gl.clear(gl.COLOR_BUFFER_BIT);

	pMatrix = perspective( 45, 1, 0.05, 10 );

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// fillCubesArray();
	fillFaces();

	for (var i = 0; i < cubes.length; i++) {
		cubes[i].computeAllRot();
	}

	// compute rotation HERE!!! (new function tbh)
	computeRotations();

	// Call the drawModel function !!
	// for(var i = 0; i < cubes.length; i++){
	// 	cubes[i].drawModel(); 		
	// }

	for (var i = 0; i < 9; i++) {
		leftFace[i].drawModel();
		rightFace[i].drawModel();
		bottomFace[i].drawModel();
		topFace[i].drawModel();
		backFace[i].drawModel();
		frontFace[i].drawModel();
	}
}


function changeCubesX(){
	if(angleXl == 90 || angleXl == -270){	
			// corner cubes
			temp = cubes[0];
			cubes[0] = cubes[2];
			cubes[2] = cubes[8];
			cubes[8] = cubes[6];
			cubes[6] = temp;
			
			// middle cubes
			temp = cubes[1];
			cubes[1] = cubes[5];
			cubes[5] = cubes[7];
			cubes[7] = cubes[3];
			cubes[3] = temp;
		}
		else if(angleXl == 180 || angleXl == -180){
			// corner cubes
			temp = cubes[0];
			temp2 = cubes[2];
			cubes[0] = cubes[8];
			cubes[2] = cubes[6];
			cubes[8] = temp;
			cubes[6] = temp2;
			
			// middle cubes
			temp = cubes[1];
			temp2 = cubes[3];
			cubes[1] = cubes[7];
			cubes[3] = cubes[5];
			cubes[5] = temp2;
			cubes[7] = temp;
		}
		else if(angleXl == 270 || angleXl == -90){
			// corner cubes
			temp = cubes[0];
			cubes[0] = cubes[6];
			cubes[6] = cubes[8];
			cubes[8] = cubes[2];
			cubes[2] = temp;
			
			// middle cubes
			temp = cubes[1];
			cubes[1] = cubes[3];
			cubes[3] = cubes[7];
		cubes[7] = cubes[5];
		cubes[5] = temp;
	}
}

function changeCubesY(){
	if(angleYl == 90 || angleYl == -270){	
			// corner cubes
			temp = cubes[6];
			cubes[6] = cubes[24];
			cubes[24] = cubes[26];
			cubes[26] = cubes[8];
			cubes[8] = temp;
			
			// middle cubes
			temp = cubes[7];
			cubes[7] = cubes[15];
			cubes[15] = cubes[25];
			cubes[25] = cubes[17];
			cubes[17] = temp;
			console.log("changed Y");
		}
		else if(angleYl == 180 || angleYl == -180){
			// corner cubes
			temp = cubes[6];
			temp2 = cubes[8];
			cubes[6] = cubes[26];
			cubes[8] = cubes[24];
			cubes[26] = temp;
			cubes[24] = temp2;
			
			// middle cubes
			temp = cubes[7];
			temp2 = cubes[15];
			cubes[7] = cubes[25];
			cubes[15] = cubes[17];
			cubes[17] = temp2;
			cubes[25] = temp;
		}
		else if(angleYl == 270 || angleYl == -90){
			// corner cubes
			temp = cubes[6];
			cubes[6] = cubes[8];
			cubes[8] = cubes[26];
			cubes[26] = cubes[24];
			cubes[24] = temp;
			
			// middle cubes
			temp = cubes[7];
			cubes[7] = cubes[17];
			cubes[17] = cubes[25];
			cubes[25] = cubes[15];
			cubes[15] = temp;
		}
}
// compute rotations
// tx = -0.5 -> 0,1,2,3,4,5,6,7,8
// tx = 0.0  -> 9,10,11,12,13,14,15,16,17
// tx = 0.5  -> 18,19,20,21,22,23,24,25,26

// ty = -0.5 -> 0,1,2,9,10,11,18,19,20
// ty = 0.0  -> 3,4,5,12,13,14,21,22,23
// ty = 0.5  -> 6,7,8,15,16,17,24,25,26

// tz = -0.5 -> 0,3,6,9,12,15,18,21,24
// tz = 0.0  -> 1,4,7,10,13,16,19,22,25
// tz = 0.5  -> 2,5,8,11,14,17,20,23,26

function computeRotations(){
	var temp, temp2;
	if(angleZl){
		cubes[0].rotationZ(angleZl);
		cubes[3].rotationZ(angleZl);
		cubes[6].rotationZ(angleZl);
		cubes[9].rotationZ(angleZl);
		cubes[12].rotationZ(angleZl);
		cubes[15].rotationZ(angleZl);
		cubes[18].rotationZ(angleZl);
		cubes[21].rotationZ(angleZl);
		cubes[24].rotationZ(angleZl);
	}
	
	if(angleYl){
		// changeCubesX();
		cubes[6].rotationY(angleYl);
		cubes[7].rotationY(angleYl);
		cubes[8].rotationY(angleYl);
		cubes[15].rotationY(angleYl);
		cubes[16].rotationY(angleYl);
		cubes[17].rotationY(angleYl);
		cubes[24].rotationY(angleYl);
		cubes[25].rotationY(angleYl);
		cubes[26].rotationY(angleYl);
	}

	if(angleXl){
		// changeCubesY();
		
		cubes[0].rotationX(angleXl);
		cubes[1].rotationX(angleXl);
		cubes[2].rotationX(angleXl);
		cubes[3].rotationX(angleXl);
		cubes[4].rotationX(angleXl);
		cubes[5].rotationX(angleXl);
		cubes[6].rotationX(angleXl);
		cubes[7].rotationX(angleXl);
		cubes[8].rotationX(angleXl);
	}
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
		angleXl = 0;
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

		gl.enable( gl.DEPTH_TEST );

		for (var i = 0; i < colors.length; i++) {
			colors2[i]= colors[i];
		}



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
