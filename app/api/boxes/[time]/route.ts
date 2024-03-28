// GET BOXES
import prisma from "@/utils/prisma";

export async function GET(request: Request) {
  try {
    // get all boxes within a certain area
    const boxes = await prisma.box.findMany({
      cacheStrategy: {
        ttl: 5,
      }
    });
    const features = boxes.map((box) => {
      return {
        type: "Feature",
        properties: {
          id: box.id,
          boxType: box.collectorId ? "opened" : "closed",
        },
        geometry: {
          type: "Point",
          coordinates: [box.longitude, box.latitude],
        },
      };
    });

    const geoJSON = {
      type: "FeatureCollection",
      features,
    };

    return Response.json({
      collect: null,
      boxes: geoJSON,
    });
  } catch (error) {
    throw new Error(`BOXES ERROR: ${error}`);
  }
}
