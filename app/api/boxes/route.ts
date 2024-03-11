import prisma from "@/utils/prisma";
import { encodeGeoHash } from "@/utils/geoHash";
import { rand } from "@/utils";

function generateRandomPoint(centerLatitude: number, centerLongitude: number, radiusInMeters: number) {
    const earthRadiusInMeters = 6371000;
    const radiusInRadians = radiusInMeters / earthRadiusInMeters;
  
    const u = Math.random();
    const v = Math.random();
  
    const w = radiusInRadians * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
  
    // Adjust the x-coordinate (longitude) for the shrinking of the east-west distances
    const newLat = centerLatitude + (y * (180 / Math.PI));
    const newLon = centerLongitude + (x * (180 / Math.PI)) / Math.cos(centerLatitude * Math.PI/180);
  
    return { latitude: newLat, longitude: newLon };
  }
  

export async function POST(request: Request) {
  const { latitude, longitude, boxCount, min, max, radius } = await request.json(); // Assume radius is in meters

  const boxes = Array.from({ length: boxCount }, () => {
    const randomPoint = generateRandomPoint(latitude, longitude, radius);
    const lat = randomPoint.latitude;
    const long = randomPoint.longitude;

    return {
      latitude: lat,
      longitude: long,
      points: rand(min, max),
      geoHash: encodeGeoHash(lat, long),
    };
  });

  const boxesResult = await prisma.box.createMany({
    data: boxes,
  });

  return Response.json({ success: true, boxes: boxesResult });
}
