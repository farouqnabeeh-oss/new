/**
 * Geolocation & Distance utilities for Uptown Platform
 */

export type UserLocation = {
  latitude: number;
  longitude: number;
};

/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Gets the user's current position using the Geolocation API.
 */
export async function getUserCurrentPosition(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Finds the nearest branch from a list of branches based on user coordinates.
 */
export function findNearestBranch<T extends { latitude: number | null; longitude: number | null }>(
  userLat: number,
  userLon: number,
  branches: T[]
): T | null {
  let nearest: T | null = null;
  let minDistance = Infinity;

  for (const branch of branches) {
    if (branch.latitude !== null && branch.longitude !== null) {
      const distance = calculateDistance(userLat, userLon, branch.latitude, branch.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = branch;
      }
    }
  }

  return nearest;
}
