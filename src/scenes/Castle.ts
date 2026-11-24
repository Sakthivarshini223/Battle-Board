import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
  TransformNode
} from "@babylonjs/core";

interface CastleOptions {
  name: string;
  color: Color3;
  position: Vector3;
  rotation: number;
}

function makeMaterial(
  scene: Scene,
  name: string,
  color: Color3
): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = color;
  material.specularColor = new Color3(0.12, 0.12, 0.12);
  return material;
}

function createCastleBox(
  scene: Scene,
  name: string,
  parent: TransformNode,
  width: number,
  height: number,
  depth: number,
  position: Vector3,
  material: StandardMaterial
) {
  const box = MeshBuilder.CreateBox(
    name,
    { width, height, depth },
    scene
  );

  box.parent = parent;
  box.position = position;
  box.material = material;

  return box;
}

export function createCastle(
  scene: Scene,
  options: CastleOptions
): TransformNode {
  const { name, color, position, rotation } = options;

  const root = new TransformNode(`${name}_root`, scene);

  root.position = position;
  root.rotation.y = rotation;

  const stoneMaterial = makeMaterial(
    scene,
    `${name}_stone`,
    new Color3(color.r * 0.78, color.g * 0.78, color.b * 0.78)
  );

  const lightStoneMaterial = makeMaterial(
    scene,
    `${name}_lightStone`,
    new Color3(
      color.r * 0.55 + 0.45,
      color.g * 0.55 + 0.45,
      color.b * 0.55 + 0.45
    )
  );

  const darkStoneMaterial = makeMaterial(
    scene,
    `${name}_darkStone`,
    new Color3(color.r * 0.42, color.g * 0.42, color.b * 0.42)
  );

  const accentMaterial = makeMaterial(
    scene,
    `${name}_accent`,
    color
  );

  const doorMaterial = makeMaterial(
    scene,
    `${name}_door`,
    new Color3(0.12, 0.045, 0.035)
  );

  createCastleBox(
    scene, `${name}_foundation`, root,
    3.5, 0.25, 2.8,
    new Vector3(0, 0.125, 0),
    darkStoneMaterial
  );

  const tower = MeshBuilder.CreateCylinder(
    `${name}_tower`,
    {
      height: 2.8,
      diameterTop: 2.45,
      diameterBottom: 3.15,
      tessellation: 4
    },
    scene
  );

  tower.parent = root;
  tower.position.y = 1.65;
  tower.rotation.y = Math.PI / 4;
  tower.material = stoneMaterial;

  for (let i = 0; i < 3; i++) {
    createCastleBox(
      scene, `${name}_stoneCourse_${i}`, root,
      2.65 - i * 0.06, 0.09, 0.055,
      new Vector3(0, 0.8 + i * 0.75, 1.08 - i * 0.08),
      darkStoneMaterial
    );
  }

  for (let i = 0; i < 3; i++) {
    createCastleBox(
      scene, `${name}_brickJoint_${i}`, root,
      0.045, 0.42, 0.06,
      new Vector3(
        -0.7 + i * 0.7,
        1.05 + (i % 2) * 0.7,
        1.05 - (i % 2) * 0.08
      ),
      lightStoneMaterial
    );
  }

  createCastleBox(
    scene, `${name}_topPlatform`, root,
    3.6, 0.28, 2.9,
    new Vector3(0, 3.05, 0),
    darkStoneMaterial
  );

  createCastleBox(
    scene, `${name}_topSurface`, root,
    3.35, 0.10, 2.65,
    new Vector3(0, 3.23, 0),
    lightStoneMaterial
  );

  const wallY = 3.55;

  createCastleBox(
    scene, `${name}_frontWall`, root,
    3.4, 0.55, 0.25,
    new Vector3(0, wallY, 1.25),
    stoneMaterial
  );

  createCastleBox(
    scene, `${name}_backWall`, root,
    3.4, 0.55, 0.25,
    new Vector3(0, wallY, -1.25),
    stoneMaterial
  );

  createCastleBox(
    scene, `${name}_leftWall`, root,
    0.25, 0.55, 2.5,
    new Vector3(-1.58, wallY, 0),
    stoneMaterial
  );

  createCastleBox(
    scene, `${name}_rightWall`, root,
    0.25, 0.55, 2.5,
    new Vector3(1.58, wallY, 0),
    stoneMaterial
  );

  const crenelPositions = [-1.2, -0.4, 0.4, 1.2];

  crenelPositions.forEach((x, index) => {
    createCastleBox(
      scene, `${name}_frontCrenel_${index}`, root,
      0.48, 0.55, 0.35,
      new Vector3(x, 4.05, 1.25),
      lightStoneMaterial
    );

    createCastleBox(
      scene, `${name}_backCrenel_${index}`, root,
      0.48, 0.55, 0.35,
      new Vector3(x, 4.05, -1.25),
      lightStoneMaterial
    );

    createCastleBox(
      scene, `${name}_leftCrenel_${index}`, root,
      0.35, 0.55, 0.48,
      new Vector3(-1.58, 4.05, x),
      lightStoneMaterial
    );

    createCastleBox(
      scene, `${name}_rightCrenel_${index}`, root,
      0.35, 0.55, 0.48,
      new Vector3(1.58, 4.05, x),
      lightStoneMaterial
    );
  });

  const doorArch = MeshBuilder.CreateCylinder(
    `${name}_doorArch`,
    {
      diameter: 1.12,
      height: 0.10,
      tessellation: 32
    },
    scene
  );

  doorArch.parent = root;
  doorArch.position = new Vector3(0, 1.02, 1.12);
  doorArch.rotation.x = Math.PI / 2;
  doorArch.material = doorMaterial;

  createCastleBox(
    scene, `${name}_doorOpening`, root,
    1.0, 1.05, 0.12,
    new Vector3(0, 0.62, 1.12),
    doorMaterial
  );

  createCastleBox(
    scene, `${name}_doorDetail`, root,
    0.10, 0.75, 0.025,
    new Vector3(0, 0.60, 1.20),
    darkStoneMaterial
  );

  createCastleBox(
    scene, `${name}_colourBanner`, root,
    0.75, 0.12, 0.06,
    new Vector3(0, 2.35, 1.00),
    accentMaterial
  );

  return root;
}

export function createAllCastles(scene: Scene): void {
  const castleDistance = 9.5;

  createCastle(scene, {
    name: "Castle_1_Yellow",
    color: new Color3(1, 0.88, 0),
    position: new Vector3(0, 0, -castleDistance),
    rotation: 0
  });

  createCastle(scene, {
    name: "Castle_2_Green",
    color: new Color3(0.05, 0.67, 0.27),
    position: new Vector3(castleDistance, 0, 0),
    rotation: -Math.PI / 2
  });

  createCastle(scene, {
    name: "Castle_3_Blue",
    color: new Color3(0.20, 0.25, 0.80),
    position: new Vector3(0, 0, castleDistance),
    rotation: Math.PI
  });

  createCastle(scene, {
    name: "Castle_4_Red",
    color: new Color3(0.92, 0.08, 0.12),
    position: new Vector3(-castleDistance, 0, 0),
    rotation: Math.PI / 2
  });
}
