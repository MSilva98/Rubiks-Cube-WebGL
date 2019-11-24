
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

// eventListeners
	// NEW ---Handling the mouse

	// From learningwebgl.com

    canvas.onmousedown = handleMouseDown;

    document.onmouseup = handleMouseUp;

    document.onmousemove = handleMouseMove;


function rotation2D(angle, t1, t2){
	var rotated1;
	var rotated2;
	rotated1 = t1*Math.cos(radians(angle))-t2*Math.sin(radians(angle));
	rotated2 = t1*Math.sin(radians(angle))+t2*Math.cos(radians(angle));
	return [rotated1, rotated2];
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
