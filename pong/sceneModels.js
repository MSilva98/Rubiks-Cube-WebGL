//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector

	this.tx = 0.0;

	this.ty = 0.0;

	this.tz = 0.0;

	// Rotation angles

	this.rotAngleXX = 0.0;

	this.rotAngleYY = 0.0;

	this.rotAngleZZ = 0.0;

	// Scaling factors

	this.sx = 1.0;

	this.sy = 1.0;

	this.sz = 1.0;

	// Animation controls

	this.rotXXOn = false;

	this.rotYYOn = false;

	this.rotZZOn = false;

	this.rotXXSpeed = 1.0;

	this.rotYYSpeed = 1.0;

	this.rotZZSpeed = 1.0;

	this.rotXXDir = 1;

	this.rotYYDir = 1;

	this.rotZZDir = 1;

	// Material features

	this.kAmbi = [ 0.5, 0.5, 0.5 ];

	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;

	this.blend = false;

	this.primitive = 0;
}

function singleTriangleModel( ) {

	var triangle = new emptyModelFeatures();

	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE

		-0.5, -0.5,  0.5,

		 0.5, -0.5,  0.5,

		 0.5,  0.5,  0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE

		 0.0,  0.0,  1.0,

		 0.0,  0.0,  1.0,

		 0.0,  0.0,  1.0,
	];

	return triangle;
}


function simpleCubeModel( ) {

	var cube = new emptyModelFeatures();

	cube.vertices = [

		-1.000000, -1.000000,  1.000000,
		 1.000000,  1.000000,  1.000000,
		-1.000000,  1.000000,  1.000000,
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000,
		 1.000000,  1.000000,  1.000000,
         1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000, -1.000000,
		 1.000000,  1.000000, -1.000000,
         1.000000, -1.000000,  1.000000,
         1.000000,  1.000000, -1.000000,
         1.000000,  1.000000,  1.000000,
        -1.000000, -1.000000, -1.000000,
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000,
        -1.000000, -1.000000, -1.000000,
         1.000000,  1.000000, -1.000000,
         1.000000, -1.000000, -1.000000,
        -1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000,  1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000,  1.000000,  1.000000,
		-1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000,  1.000000,
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel( subdivisionDepth = 0 ) {

	var cube = new simpleCubeModel();

	midPointRefinement( cube.vertices, subdivisionDepth );

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function simpleTetrahedronModel( ) {

	var tetra = new emptyModelFeatures();

	tetra.vertices = [

		-1.000000,  0.000000, -0.707000,
         0.000000,  1.000000,  0.707000,
         1.000000,  0.000000, -0.707000,
         1.000000,  0.000000, -0.707000,
         0.000000,  1.000000,  0.707000,
         0.000000, -1.000000,  0.707000,
        -1.000000,  0.000000, -0.707000,
         0.000000, -1.000000,  0.707000,
         0.000000,  1.000000,  0.707000,
        -1.000000,  0.000000, -0.707000,
         1.000000,  0.000000, -0.707000,
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}

function simpleTunelModel( ) {

	var tunel = new emptyModelFeatures();

	tunel.vertices = [

		// TOP TRIANGLES
		-1.0, 1.0, -6.0,
		 1.0, 1.0,  6.0,
		-1.0, 1.0,  6.0,
		-1.0, 1.0, -6.0,
		 1.0, 1.0, -6.0,
		 1.0, 1.0,  6.0,

		//BOT TRIANGLES
	    -1.0, -1.0,  6.0,
	 	 1.0, -1.0, -6.0,
	    -1.0, -1.0, -6.0,
	    -1.0, -1.0,  6.0,
		 1.0, -1.0,  6.0,
		 1.0, -1.0, -6.0,

		//RIGHT TRIANGLES
	   	 1.0, -1.0,  6.0,
		 1.0,  1.0,  6.0,
	   	 1.0,  1.0, -6.0,
   		 1.0, -1.0,  6.0,
		 1.0,  1.0, -6.0,
		 1.0, -1.0, -6.0,

		//LEFT TRIANGLES
	   	-1.0, -1.0,  6.0,
		-1.0, -1.0, -6.0,
	    -1.0,  1.0,  6.0,

		-1.0, -1.0, -6.0,
		-1.0,  1.0, -6.0,
		-1.0,  1.0,  6.0,

		// BACK TRIANGLES
	    -1.0, -1.0, -6.0,
		 1.0, -1.0, -6.0,
	    -1.0,  1.0, -6.0,
		 1.0, -1.0, -6.0,
		 1.0,  1.0, -6.0,
		-1.0,  1.0, -6.0,			
	];

	computeVertexNormals( tunel.vertices, tunel.normals );

	return tunel;
}

function panelModel( ) {

	var panel = new emptyModelFeatures();

	panel.vertices = [
	    -1.0, -1.0, 1.0,
		 1.0,  1.0, 1.0,
		-1.0,  1.0, 1.0,
		-1.0, -1.0, 1.0,
		 1.0, -1.0, 1.0,
		 1.0,  1.0, 1.0,

	];

	computeVertexNormals( panel.vertices, panel.normals );

	return panel;
}

function tetrahedronModel( subdivisionDepth = 0 ) {

	var tetra = new simpleTetrahedronModel();

	midPointRefinement( tetra.vertices, subdivisionDepth );

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}


function sphereModel( subdivisionDepth = 2 ) {

	var sphere = new simpleCubeModel();

	midPointRefinement( sphere.vertices, subdivisionDepth );

	moveToSphericalSurface( sphere.vertices )

	computeVertexNormals( sphere.vertices, sphere.normals );

	return sphere;
}

function horizontalSquareModel( ) {

	var horizontalSquare = new emptyModelFeatures();

	horizontalSquare.vertices = [

		-1.0, -1.0,  1.0,
		 1.0,  -1.0,   -1.0,
		-1.0,  -1.0,  -1.0,

		-1.0,  -1.0,  1.0,
		 1.0,  -1.0,  1.0,
		 1.0,  -1.0,  -1.0,

	];

	computeVertexNormals( horizontalSquare.vertices, horizontalSquare.normals );
	return horizontalSquare;
}

function circleModel( subdivisionDepth = 2, r) {

	var circle = new horizontalSquareModel();
	circle.vertices.splice(0,circle.vertices.length);

	for (var i = 0; i < 360; i++) {
		const angle = 2*Math.PI*i/360;
		const x = (r*Math.cos(angle))*2.3;
		const y = (r*Math.sin(angle))-1.5;
		circle.vertices.push(x,y,0);
	}
	circle.primitive = 1;

	computeVertexNormals( circle.vertices, circle.normals );
	return circle;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Model 0 --- Ball
sceneModels.push( new sphereModel(5) );
sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.03;
sceneModels[0].kAmbi = [0.2,0.2,0.2];
sceneModels[0].kDiff = [0.9,0.9,0.0];
sceneModels[0].kSpec = [1.0,1.0,1.0];
sceneModels[0].Phong = 32;

// Model 1 --- Panel
sceneModels.push( new panelModel() );
sceneModels[1].sx = sceneModels[1].sy = sceneModels[1].sz = 0.045;
sceneModels[1].tx = sceneModels[1].ty = 0;
sceneModels[1].tz = 1.776;
sceneModels[1].blend = true;
sceneModels[1].kAmbi = [0.1,0.1,0.1];
sceneModels[1].kDiff = [0.0,0.7,0.0];
sceneModels[1].kSpec = [0.7,0.7,0.7];
sceneModels[1].Phong = 32;

// Model 2 --- Shadow ball
sceneModels.push( new circleModel(5, 0.4) );
sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.03;
sceneModels[2].ty = -0.2655; //scale tunel - sclale shadow
sceneModels[2].kAmbi = [0.1,0.1,0.1];
sceneModels[2].kDiff = [0.5,0.5,0.5];
sceneModels[2].kSpec = [0.1,0.1,0.1];
sceneModels[2].Phong = 100;

// Model 3 --- Tunel
sceneModels.push( new simpleTunelModel() );
sceneModels[3].sx = sceneModels[3].sy = sceneModels[3].sz = 0.296;
sceneModels[3].kAmbi = [0.0,0.0,0.0];
sceneModels[3].kDiff = [60/255,100/255,180/255];
sceneModels[3].kSpec = [1.0,1.0,1.0];
sceneModels[3].Phong = 80;