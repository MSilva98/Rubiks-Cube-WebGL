// Class to instanciate each cube of the rubiks cube

class Cube{

	constructor(mvMatrix, x,y,z, c){
		this.mvMatrix = mvMatrix;
		this.mvMatrixFix = mvMatrix; 
		this.x = x;
		this.y = y;
		this.z = z;
	}

	drawModel(){
		this.mvMatrix = mult(this.mvMatrix,translationMatrix(this.x,this.y,this.z));
		this.mvMatrix = mult(this.mvMatrix, scalingMatrix( 0.25, 0.25, 0.25));
		
		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(this.mvMatrix)));

		// NEW - Aux. Function for computing the illumination

		computeIllumination(this.mvMatrix);

		initBuffers();

		// Drawing
		gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	}

	computeAllRot(){
		this.mvMatrix = mult(this.mvMatrix, rotationXXMatrix(globalAngleX));
		this.mvMatrix = mult(this.mvMatrix, rotationYYMatrix(globalAngleY));
		this.mvMatrix = mult(this.mvMatrix, rotationZZMatrix(globalAngleZ));
	}

	setMat(mvMatrix){
		this.mvMatrix = mvMatrix;
	}

	getMat(){
		return this.mvMatrix;
	}

	rotationX(angle, matrix){
		this.mvMatrix = mult(matrix, rotationXXMatrix(angle));
	}

	rotationY(angle, matrix){
		this.mvMatrix = mult(matrix, rotationYYMatrix(angle));
	}

	rotationZ(angle){
		this.mvMatrix = mult(this.mvMatrix, rotationZZMatrix(angle));
	}	
}

