import {
  Enums,
  RenderingEngine,
  Types,
  init as csRenderInit,
  imageLoader
} from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";

import { initCornerstoneDICOMImageLoader, initVolumeLoader } from "./loader";
import { ctVoiRange, initProviders } from "./config";

async function run() {
  const content = document.getElementById("dicom-container");
  const element = document.createElement("div");
  element.id = "cornerstone-basic-stack";
  element.style.width = "500px";
  element.style.height = "500px";
  content.appendChild(element);

  // Init Cornerstone and related libraries
  initProviders();
  initCornerstoneDICOMImageLoader();
  initVolumeLoader();
  await csRenderInit();
  csToolsInit();

  // Get Cornerstone imageIds and fetch metadata into RAM
  const imageIds = ["https://raw.githubusercontent.com/cornerstonejs/cornerstone3D/main/packages/dicomImageLoader/testImages/CTImage.dcm_JPEGProcess14TransferSyntax_1.2.840.10008.1.2.4.57.dcm"];

  // Instantiate a rendering engine
  const renderingEngineId = "myRenderingEngine";
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create a stack viewport
  const viewportId = "CT_STACK";
  const viewportInput = {
    viewportId,
    type: Enums.ViewportType.STACK,
    element,
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2],
    },
  };

  renderingEngine.enableElement(viewportInput);

  // Get the stack viewport that was created
  const viewport = <Types.IStackViewport>(
    renderingEngine.getViewport(viewportId)
  );

  // Define a stack containing a single image
  const stack = [imageIds[0]];

  // Set the stack on the viewport
  await viewport.setStack(stack);

  // Set the VOI of the stack
  viewport.setProperties({ voiRange: ctVoiRange });

  // Render the image
  viewport.render();
}

export function handleDiCom(btn: HTMLButtonElement | null): void {
  if (!btn) {
    return;
  }
  btn.addEventListener("click", run);
}
