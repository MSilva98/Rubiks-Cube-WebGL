// Class to instanciate each cube of the rubiks cube

class Cube{

	constructor(mvMatrix, x,y,z){
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

	rotationX(angle, angleAxis){
		var t1 = this.y;
		var t2 = this.z;
		var temp1, temp2;
		this.mvMatrix = mult(this.mvMatrix, rotationXXMatrix(angle));
		temp1 = t1*Math.cos(radians(angleAxis))-t2*Math.sin(radians(angleAxis));
		temp2 = t1*Math.sin(radians(angleAxis))+t2*Math.cos(radians(angleAxis));
		this.y = temp1;
		this.z = temp2;
	}

	rotationY(angle){
		this.mvMatrix = mult(this.mvMatrix, rotationYYMatrix(angle));
	}

	rotationZ(angle){
		this.mvMatrix = mult(this.mvMatrix, rotationZZMatrix(angle));
	}	

	// rotateOwnX(angle){
	// 	this.mvMatrix = mult(this.mvMatrix, translationMatrix(this.x,this.y,this.z));
	// 	this.mvMatrix = mult(this.mvMatrix, rotationXXMatrix(angle));
	// 	this.mvMatrix = mult(this.mvMatrix, translationMatrix(-this.x,-this.y,-this.z));
	// }

}

