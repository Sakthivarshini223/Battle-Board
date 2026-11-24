
import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
  VertexData,
  Mesh
} from "@babylonjs/core";

const COLORS = {
  red: new Color3(0.92, 0.08, 0.12),
  lightRed: new Color3(1, 0.55, 0.55),
  yellow: new Color3(1, 0.88, 0),
  lightYellow: new Color3(1, 0.94, 0.65),
  green: new Color3(0.05, 0.67, 0.27),
  lightGreen: new Color3(0.65, 0.95, 0.72),
  blue: new Color3(0.20, 0.25, 0.80),
  lightBlue: new Color3(0.60, 0.68, 0.95),
  white: new Color3(0.96, 0.96, 0.96),
  border: new Color3(0.08, 0.08, 0.08)
};

function createMaterial(
  scene: Scene,
  name: string,
  color: Color3
): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = color;
  material.specularColor = new Color3(0.08, 0.08, 0.08);
  return material;
}

function createTriangle(
  scene: Scene,
  name: string,
  points: Vector3[],
  material: StandardMaterial
) {
  const triangle = new Mesh(name, scene);

  const positions = [
    points[0].x, points[0].y, points[0].z,
    points[1].x, points[1].y, points[1].z,
    points[2].x, points[2].y, points[2].z
  ];

  const indices = [0, 1, 2];
  const normals: number[] = [];

  VertexData.ComputeNormals(positions, indices, normals);

  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;

  data.applyToMesh(triangle);
  triangle.material = material;

  return triangle;
}

export function createLudoBoard(scene: Scene): void {
  const materials = {
    red: createMaterial(scene, "red", COLORS.red),
    yellow: createMaterial(scene, "yellow", COLORS.yellow),
    green: createMaterial(scene, "green", COLORS.green),
    blue: createMaterial(scene, "blue", COLORS.blue),

    lightRed: createMaterial(scene, "lightRed", COLORS.lightRed),
    lightYellow: createMaterial(scene, "lightYellow", COLORS.lightYellow),
    lightGreen: createMaterial(scene, "lightGreen", COLORS.lightGreen),
    lightBlue: createMaterial(scene, "lightBlue", COLORS.lightBlue),

    white: createMaterial(scene, "white", COLORS.white),
    border: createMaterial(scene, "border", COLORS.border)
  };

  const base = MeshBuilder.CreateBox(
    "boardBase",
    {
      width: 15.3,
      height: 0.3,
      depth: 15.3
    },
    scene
  );

  base.position.y = -0.18;
  base.material = materials.border;

  const ground = MeshBuilder.CreateGround(
    "ground",
    {
      width: 30,
      height: 30
    },
    scene
  );

  ground.position.y = -0.36;

  const groundMaterial = createMaterial(
    scene,
    "groundMaterial",
    new Color3(0.24, 0.28, 0.32)
  );

  ground.material = groundMaterial;

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      let material: StandardMaterial | null = null;

      if (row <= 5 && col <= 5) {
        material = materials.lightRed;
      } else if (row <= 5 && col >= 9) {
        material = materials.lightYellow;
      } else if (row >= 9 && col <= 5) {
        material = materials.lightBlue;
      } else if (row >= 9 && col >= 9) {
        material = materials.lightGreen;
      } else if (
        (row >= 6 && row <= 8) ||
        (col >= 6 && col <= 8)
      ) {
        material = materials.white;
      }

      if (col === 7 && row >= 1 && row <= 5) {
        material = materials.yellow;
      }

      if (row === 7 && col >= 9 && col <= 13) {
        material = materials.green;
      }

      if (col === 7 && row >= 9 && row <= 13) {
        material = materials.blue;
      }

      if (row === 7 && col >= 1 && col <= 5) {
        material = materials.red;
      }

      const isCenter =
        row >= 6 && row <= 8 &&
        col >= 6 && col <= 8;

      if (material !== null && !isCenter) {
        const tile = MeshBuilder.CreateBox(
          `tile_${row}_${col}`,
          {
            width: 0.96,
            height: 0.12,
            depth: 0.96
          },
          scene
        );

        tile.position = new Vector3(
          col - 7,
          0.03,
          row - 7
        );

        tile.material = material;
      }
    }
  }

  const homePads = [
    {
      x: -4.5,
      z: -4.5,
      color: COLORS.red,
      lightColor: COLORS.lightRed
    },
    {
      x: 4.5,
      z: -4.5,
      color: COLORS.yellow,
      lightColor: COLORS.lightYellow
    },
    {
      x: 4.5,
      z: 4.5,
      color: COLORS.green,
      lightColor: COLORS.lightGreen
    },
    {
      x: -4.5,
      z: 4.5,
      color: COLORS.blue,
      lightColor: COLORS.lightBlue
    }
  ];

  for (let i = 0; i < homePads.length; i++) {
    const home = homePads[i];

    const pad = MeshBuilder.CreateBox(
      `homePad_${i}`,
      {
        width: 4.2,
        height: 0.08,
        depth: 4.2
      },
      scene
    );

    pad.position = new Vector3(home.x, 0.12, home.z);

    const padMaterial = createMaterial(
      scene,
      `homePadMaterial_${i}`,
      home.lightColor
    );

    pad.material = padMaterial;

    const positions = [
     [-0.8, -0.8],
      [0.8, -0.8],
      [-0.8, 0.8],
      [0.8, 0.8]
    ];

    for (let j = 0; j < positions.length; j++) {
      const slot = MeshBuilder.CreateCylinder(
        `homeSlot_${i}_${j}`,
        {
          diameter: 0.75,
          height: 0.035,
          tessellation: 32
        },
        scene
      );

      slot.position = new Vector3(
        home.x + positions[j][0],
        0.19,
        home.z + positions[j][1]
      );

      const slotMaterial = createMaterial(
        scene,
        `slotMaterial_${i}_${j}`,
        home.color
      );

      slot.material = slotMaterial;
    }
  }

  const center = new Vector3(0, 0.17, 0);

  createTriangle(
    scene,
    "yellowCenter",
    [
      new Vector3(-1.5, 0.17, -1.5),
      new Vector3(1.5, 0.17, -1.5),
      center
    ],
    materials.yellow
  );

  createTriangle(
    scene,
    "greenCenter",
    [
      new Vector3(1.5, 0.17, -1.5),
      new Vector3(1.5, 0.17, 1.5),
      center
    ],
    materials.green
  );

  createTriangle(
    scene,
    "blueCenter",
    [
      new Vector3(1.5, 0.17, 1.5),
      new Vector3(-1.5, 0.17, 1.5),
      center
    ],
    materials.blue
  );

  createTriangle(
    scene,
    "redCenter",
    [
      new Vector3(-1.5, 0.17, 1.5),
      new Vector3(-1.5, 0.17, -1.5),
      center
    ],
    materials.red
  );
}
