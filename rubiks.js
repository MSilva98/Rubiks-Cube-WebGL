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
var angle1 = 0; 
var angle2 = 0; 
var angle3 = 0; 

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
var staticCube;
var leftFace = [[],[],[]];
var rightFace = [[],[],[]];
var bottomFace = [[],[],[]];
var topFace = [[],[],[]];
var frontFace = [[],[],[]];
var backFace = [[],[],[]];

function fillCubesArray(){
	var mvMatrix = mat4();
	globalTz = -4;
	mvMatrix = mult(mvMatrix,translationMatrix(0,0,globalTz));
	var y1 = y2 = y3 = y4 = 2;
	var x1 = x2 = x5 = x6 = 2;
	var c = y5 = y6 = x3 = x4 = 0;
	for(var x = -0.5; x <= 0.5; x += 0.5){
		for(var y = -0.5; y <= 0.5; y += 0.5){
			for(var z = -0.5; z <= 0.5; z += 0.5){	
				cubes[c] = new Cube(mvMatrix, x,y,z, c);
				if(x == -0.5){
					leftFace[x1][y1] = c;
					y1--;
					if(y1 == -1){
						y1 = 2;
						x1--;
					}
				}
				if(x == 0.5){
					rightFace[x2][y2] = c;
					y2--;
					if(y2 == -1){
						y2 = 2;
						x2--;
					}
				}
				if(y == -0.5){
					bottomFace[x3][y3] = c;
					y3--;
					if(y3 == -1){
						y3 = 2;
						x3++;
					}	
				}
				if(y == 0.5){
					topFace[x4][y4] = c;
					y4--;
					if(y4 == -1){
						y4 = 2;
						x4++;
					}					
				}
				if(z == -0.5){
					backFace[x5][y5] = c;
					x5--;
					if(x5 == -1){
						x5 = 2;
						y5++;
					}
				}
				if(z == 0.5){
					frontFace[x6][y6] = c;
					x6--;
					if(x6 == -1){
						x6 = 2;
						y6++;
					}
				}
				c++;
			} 	
		}	
	}
	staticCube = cubes[13];
}

function drawScene() {

	var pMatrix;
	
	// Clearing with the background color

	gl.clear(gl.COLOR_BUFFER_BIT);

	pMatrix = perspective( 45, 1, 0.05, 10 );

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	fillCubesArray();

	for (var i = 0; i < cubes.length; i++) {
		cubes[i].computeAllRot();
	}

	// compute rotation HERE!!! (new function tbh)
	// changeFaces();
	computeRotations();	

	// Call the drawModel function !!
	for(var i = 0; i < cubes.length; i++){
		cubes[i].drawModel(); 		
	}
}

function rotateCounterClockwise(matrix) {
  // reverse the individual rows
  matrix = matrix.map(function(row) {
    return row.reverse();
  });
  // swap the symmetric elements
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}

function rotateClockwise(matrix) {
  // reverse the rows
  matrix = matrix.reverse();
  // swap the symmetric elements
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}

function rotateFaceX(bool){
	var tempXl, tempXr;
	if(bool){
		// Left face
		if(angleXl){
			if(angleXl == -270){
				tempXl = 90;
			}
			else if(angleXl == -90){
				tempXl = 270;
			}
			else if(angleXl == -180){
				tempXl = 180;
			}
			else{
				tempXl = angleXl;
			}
			for (var i = 0; i < tempXl/90; i++) {
				rotateCounterClockwise(leftFace);			
			}
			topFace[0][0] = leftFace[0][0];
			topFace[0][1] = leftFace[0][1];
			topFace[0][2] = leftFace[0][2];

			bottomFace[0][0] = leftFace[2][0];
			bottomFace[0][1] = leftFace[2][1];
			bottomFace[0][2] = leftFace[2][2];
				
			frontFace[0][0] = leftFace[0][0];
			frontFace[1][0] = leftFace[1][0];
			frontFace[2][0] = leftFace[2][0];

			backFace[0][0] = leftFace[0][2];
			backFace[1][0] = leftFace[1][2];
			backFace[2][0] = leftFace[2][2];
			console.log("Changed left face");
		}
	}
	else{
		// Right Face
		if(angleXr){
			if(angleXr == -270){
				tempXr = 90;
			}
			else if(angleXr == -90){
				tempXr = 270;
			}
			else if(angleXr == -180){
				tempXr = 180;
			}
			else{
				tempXr = angleXr;
			}
			for (var i = 0; i < tempXr/90; i++) {
				rotateCounterClockwise(rightFace);			
			}
			topFace[2][0] = rightFace[0][0];
			topFace[2][1] = rightFace[0][1];
			topFace[2][2] = rightFace[0][2];

			bottomFace[2][0] = rightFace[2][0];
			bottomFace[2][1] = rightFace[2][1];
			bottomFace[2][2] = rightFace[2][2];
			
			frontFace[0][2] = rightFace[0][0];
			frontFace[1][2] = rightFace[1][0];
			frontFace[2][2] = rightFace[2][0];

			backFace[0][2] = rightFace[0][2];
			backFace[1][2] = rightFace[1][2];
			backFace[2][2] = rightFace[2][2];
			console.log("Changed right face");
		}
	}
}

function rotateFaceY(bool){
	var tempYl, tempYr;
	if(bool){	
		// Left face
		if(angleYl){
			if(angleYl == -270){
				tempYl = 90;
			}
			else if(angleYl == -90){
				tempYl = 270;
			}
			else if(angleYl == -180){
				tempYl = 180;
			}
			else{
				tempYl = angleYl;
			}
			for (var i = 0; i < tempYl/90; i++) {
				rotateCounterClockwise(topFace);			
			}

			leftFace[0][0] = topFace[0][0];
			leftFace[0][1] = topFace[0][1];
			leftFace[0][2] = topFace[0][2];

			rightFace[0][0] = topFace[2][0];
			rightFace[0][1] = topFace[2][1];
			rightFace[0][2] = topFace[2][2];
			
			frontFace[0][0] = topFace[0][0];
			frontFace[0][1] = topFace[1][0];
			frontFace[0][2] = topFace[2][0];

			backFace[0][0] = topFace[0][2];
			backFace[0][1] = topFace[1][2];
			backFace[0][2] = topFace[2][2];
			console.log("Changed top face");
		}
	}
	else{
		// Right Face
		if(angleYr){
			if(angleYr == -270){
				tempYr = 90;
			}
			else if(angleYr == -90){
				tempYr = 270;
			}
			else if(angleYr == -180){
				tempYr = 180;
			}
			else{
				tempYr = angleYr;
			}
			for (var i = 0; i < tempYr/90; i++) {
				rotateCounterClockwise(bottomFace);			
			}
			rightFace[2][0] = bottomFace[2][0];
			rightFace[2][1] = bottomFace[2][1];
			rightFace[2][2] = bottomFace[2][2];

			leftFace[2][0] = bottomFace[0][0];
			leftFace[2][1] = bottomFace[0][1];
			leftFace[2][2] = bottomFace[0][2];
			
			frontFace[2][0] = bottomFace[0][0];
			frontFace[2][1] = bottomFace[1][0];
			frontFace[2][2] = bottomFace[2][0];

			backFace[2][0] = bottomFace[0][2];
			backFace[2][1] = bottomFace[1][2];
			backFace[2][2] = bottomFace[2][2];
			console.log("Changed Bottom face");
		}
	}
}

function rotateFaceZ(bool){
	var tempZl, tempZr;
 	// Left face
	if(bool){
		if(angleZl){
			if(angleZl == -270){
				tempZl = 90;
			}
			else if(angleZl == -90){
				tempZl = 270;
			}
			else if(angleZl == -180){
				tempZl = 180;
			}
			else{
				tempZl = angleZl;
			}
			for (var i = 0; i < tempZl/90; i++) {
				rotateCounterClockwise(backFace);			
			}
			topFace[0][2] = backFace[0][0];
			topFace[1][2] = backFace[0][1];
			topFace[2][2] = backFace[0][2];

			bottomFace[0][2] = backFace[2][0];
			bottomFace[1][2] = backFace[2][1];
			bottomFace[2][2] = backFace[2][2];
			
			leftFace[0][2] = backFace[0][0];
			leftFace[1][2] = backFace[1][0];
			leftFace[2][2] = backFace[2][0];

			rightFace[0][2] = backFace[0][2];
			rightFace[1][2] = backFace[1][2];
			rightFace[2][2] = backFace[2][2];
			console.log("Changed back face");
		}
	}
	else{
		// Right Face
		if(angleZr){
			if(angleZr == -270){
				tempZr = 90;
			}
			else if(angleZr == -90){
				tempZr = 270;
			}
			else if(angleZr == -180){
				tempZr = 180;
			}
			else{
				tempZr = angleZr;
			}
			for (var i = 0; i < tempZr/90; i++) {
				rotateCounterClockwise(frontFace);			
			}
			topFace[0][0] = frontFace[0][0];
			topFace[1][0] = frontFace[0][1];
			topFace[2][0] = frontFace[0][2];

			bottomFace[0][2] = frontFace[2][0];
			bottomFace[1][2] = frontFace[2][1];
			bottomFace[2][2] = frontFace[2][2];
			
			leftFace[0][2] = frontFace[0][0];
			leftFace[1][2] = frontFace[1][0];
			leftFace[2][2] = frontFace[2][0];

			rightFace[0][0] = frontFace[0][2];
			rightFace[1][0] = frontFace[1][2];
			rightFace[2][0] = frontFace[2][2];
			console.log("Changed front face");
		}
	}
}

function computeRotations(){
	// Left Face Rotations
	cubes[leftFace[0][0]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[0][1]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[0][2]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[1][0]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[1][1]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[1][2]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[2][0]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[2][1]].rotationX(angleXl,staticCube.getMat());
	cubes[leftFace[2][2]].rotationX(angleXl,staticCube.getMat());

	// Right Face Rotations
	cubes[rightFace[0][0]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[0][1]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[0][2]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[1][0]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[1][1]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[1][2]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[2][0]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[2][1]].rotationX(angleXr,staticCube.getMat());
	cubes[rightFace[2][2]].rotationX(angleXr,staticCube.getMat());

	// Top Face Rotations
	cubes[topFace[0][0]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[0][1]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[0][2]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[1][0]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[1][1]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[1][2]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[2][0]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[2][1]].rotationY(angleYl,staticCube.getMat());
	cubes[topFace[2][2]].rotationY(angleYl,staticCube.getMat());

	// Bottom Face Rotations
	cubes[bottomFace[0][0]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[0][1]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[0][2]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[1][0]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[1][1]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[1][2]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[2][0]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[2][1]].rotationY(angleYr,staticCube.getMat());
	cubes[bottomFace[2][2]].rotationY(angleYr,staticCube.getMat());

	// Back Face Rotations
	cubes[backFace[0][0]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[0][1]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[0][2]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[1][0]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[1][1]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[1][2]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[2][0]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[2][1]].rotationZ(angleZl,staticCube.getMat());
	cubes[backFace[2][2]].rotationZ(angleZl,staticCube.getMat());

	// Front Face Rotations
	cubes[frontFace[0][0]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[0][1]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[0][2]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[1][0]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[1][1]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[1][2]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[2][0]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[2][1]].rotationZ(angleZr,staticCube.getMat());
	cubes[frontFace[2][2]].rotationZ(angleZr,staticCube.getMat());
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

		movesTrack = [];
	};
}

var lastTime = 0;

function animate() {

	var timeNow = new Date().getTime();

	if( lastTime != 0 ) {

		var elapsed = timeNow - lastTime;
			
		// XX Rotations
		if(rotateXX_left) {
			angleXl += Math.round(XX_DIR * (90 * elapsed) / 2000.0);
			if(angleXl%90 == 0){
				rotateFaceX(true);
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
				rotateFaceX(false);
				rotateXX_right = false;
			}
			if(angleXr == 360){
				angleXr = 0;
			}
	    }

	    // YY Rotations
	    if(rotateYY_left) {
			angleYl += Math.round(YY_DIR * (90 * elapsed) / 2000.0);
			if(angleYl%90 == 0){
				rotateFaceY(true);
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
				rotateFaceY(false);
				rotateYY_right = false;
			}
			if(angleYm == 360){
				angleYm = 0;
			}
	    }

	    // ZZ Rotations
	    if(rotateZZ_left) {
			angleZl += Math.round(ZZ_DIR * (90 * elapsed) / 2000.0);
			if(angleZl%90 == 0){
				rotateFaceZ(true);
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
				rotateFaceZ(false);
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
