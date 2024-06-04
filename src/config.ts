import {
  utilities as csUtils, 
  metaData
} from '@cornerstonejs/core';
const scalingPerImageId: Record<string, any> = {};

const windowWidth = 400;
const windowCenter = 40;

const lower = windowCenter - windowWidth / 2.0;
const upper = windowCenter + windowWidth / 2.0;

export const ctVoiRange = { lower, upper };

// export function setCtTransferFunctionForVolumeActor({ volumeActor }) {
//   volumeActor
//     .getProperty()
//     .getRGBTransferFunction(0)
//     .setMappingRange(lower, upper);
// }

function addInstance(imageId: string, scalingMetaData: any) {
  const imageURI = csUtils.imageIdToURI(imageId);
  scalingPerImageId[imageURI] = scalingMetaData;
}

function get(type: string, imageId: string) {
  if (type === 'scalingModule') {
    const imageURI = csUtils.imageIdToURI(imageId);
    return scalingPerImageId[imageURI];
  }
}

export function initProviders() {
  metaData.addProvider(
    get.bind({ addInstance, get }),
    10000
  );
  metaData.addProvider(
    csUtils.calibratedPixelSpacingMetadataProvider.get.bind(
      csUtils.calibratedPixelSpacingMetadataProvider
    ),
    11000
  );
}
