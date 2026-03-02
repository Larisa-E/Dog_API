(function attachApiModule(global) {
  // Small helper: fetch with timeout protection.
  async function fetchWithTimeout(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // try PHP proxy first, then use public Dog API as fallback.
  async function fetchJsonWithFallback(primaryUrl, fallbackUrl) {
    try {
      const response = await fetchWithTimeout(primaryUrl);
      if (!response.ok) {
        throw new Error("Primary endpoint failed");
      }
      return await response.json();
    } catch {
      const fallbackResponse = await fetchWithTimeout(fallbackUrl);
      if (!fallbackResponse.ok) {
        throw new Error("Fallback endpoint failed");
      }
      return await fallbackResponse.json();
    }
  }

  // get all breeds for the dropdown
  async function loadBreeds() {
    return fetchJsonWithFallback(
      "api/breeds.php",
      "https://dog.ceo/api/breeds/list/all"
    );
  }

  // get images for selected breed + optional sub-breed
  async function loadImages(breed, subBreed) {
    const encodedBreed = encodeURIComponent(breed);
    const encodedSubBreed = encodeURIComponent(subBreed || "");

    const primaryUrl = subBreed
      ? `api/images.php?breed=${encodedBreed}&subBreed=${encodedSubBreed}`
      : `api/images.php?breed=${encodedBreed}`;

    const fallbackUrl = subBreed
      ? `https://dog.ceo/api/breed/${encodedBreed}/${encodedSubBreed}/images`
      : `https://dog.ceo/api/breed/${encodedBreed}/images`;

    return fetchJsonWithFallback(primaryUrl, fallbackUrl);
  }

  // get random images used only for background
  async function loadBackgroundImages(count = 12) {
    const response = await fetchWithTimeout(`https://dog.ceo/api/breeds/image/random/${count}`);
    if (!response.ok) {
      throw new Error("Background endpoint failed");
    }
    return response.json();
  }

  // expose API helpers globally for app.js
  global.DogApi = {
    loadBreeds,
    loadImages,
    loadBackgroundImages,
  };
})(window);
