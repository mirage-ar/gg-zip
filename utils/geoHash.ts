// GEO Hashing algorithm

const base32: string = "0123456789bcdefghjkmnpqrstuvwxyz";

const refineRange = (range: { min: number; max: number }, bit: boolean) => {
  const mid = (range.min + range.max) / 2;
  if (bit) {
    range.min = mid;
  } else {
    range.max = mid;
  }
};

export function encodeGeoHash(latitude: number, longitude: number, precision: number = 12): string {
  let latRange = { min: -90, max: 90 };
  let lonRange = { min: -180, max: 180 };
  let hash: string = "";
  let hashVal: number = 0;
  let bits: number = 0;
  let even: boolean = true;

  while (hash.length < precision) {
    if (even) {
      let mid = (lonRange.min + lonRange.max) / 2;
      if (longitude > mid) {
        hashVal = (hashVal << 1) + 1;
        lonRange.min = mid;
      } else {
        hashVal = (hashVal << 1) + 0;
        lonRange.max = mid;
      }
    } else {
      let mid = (latRange.min + latRange.max) / 2;
      if (latitude > mid) {
        hashVal = (hashVal << 1) + 1;
        latRange.min = mid;
      } else {
        hashVal = (hashVal << 1) + 0;
        latRange.max = mid;
      }
    }

    even = !even;

    if (++bits == 5) {
      hash += base32.charAt(hashVal);
      bits = 0;
      hashVal = 0;
    }
  }

  return hash;
}

export function decodeGeoHash(hash: string): {
  latitude: number;
  longitude: number;
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
} {
  let latRange = { min: -90, max: 90 };
  let lonRange = { min: -180, max: 180 };
  let even: boolean = true;

  for (let i = 0; i < hash.length; i++) {
    const char = hash[i];
    const bit = base32.indexOf(char);

    for (let j = 4; j >= 0; j--) {
      const mask = 1 << j;
      if (even) {
        refineRange(lonRange, !!(bit & mask));
      } else {
        refineRange(latRange, !!(bit & mask));
      }
      even = !even;
    }
  }

  return {
    latitude: (latRange.min + latRange.max) / 2,
    longitude: (lonRange.min + lonRange.max) / 2,
    bounds: {
      minLat: latRange.min,
      maxLat: latRange.max,
      minLon: lonRange.min,
      maxLon: lonRange.max,
    },
  };
}
