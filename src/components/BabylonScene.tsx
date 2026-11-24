import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  DirectionalLight,
  Color4
} from "@babylonjs/core";

import { createLudoBoard } from "../scenes/Board";
import { createAllCastles } from "../scenes/Castle";

function BabylonScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const engine = new Engine(
      canvas,
      true,
      {
        preserveDrawingBuffer: false,
        stencil: true
      }
    );

    const scene = new Scene(engine);

    scene.clearColor = new Color4(0.12, 0.14, 0.18, 1);

    const camera = new ArcRotateCamera(
      "mainCamera",
      -Math.PI / 2,
      0.85,
      20,
      new Vector3(0, 0, 0),
      scene
    );

    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 12;
    camera.upperRadiusLimit = 30;
    camera.wheelPrecision = 40;
    camera.panningSensibility = 0;

    const hemisphericLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      scene
    );

    hemisphericLight.intensity = 0.85;

    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(-1, -2, 1),
      scene
    );

    directionalLight.intensity = 0.7;

    createLudoBoard(scene);
    createAllCastles(scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="babylon-canvas"
    />
  );
}

export default BabylonScene;
