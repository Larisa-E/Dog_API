const breedSelect = document.getElementById("breedSelect");
const subBreedSelect = document.getElementById("subBreedSelect");
const breedSearch = document.getElementById("breedSearch");
const gallery = document.getElementById("gallery");
const statusBox = document.getElementById("status");
const spinner = document.getElementById("spinner");
const loadMoreBtn = document.getElementById("loadMore");
const bgCollage = document.getElementById("bgCollage");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const modalDownload = document.getElementById("modalDownload");

// Safety check: make sure required HTML elements exist.
const requiredElements = [
  { key: "breedSelect", value: breedSelect },
  { key: "subBreedSelect", value: subBreedSelect },
  { key: "breedSearch", value: breedSearch },
  { key: "gallery", value: gallery },
  { key: "statusBox", value: statusBox },
  { key: "spinner", value: spinner },
  { key: "loadMoreBtn", value: loadMoreBtn },
  { key: "imageModal", value: imageModal },
  { key: "modalImage", value: modalImage },
  { key: "modalClose", value: modalClose },
];

const missingElements = requiredElements
  .filter((entry) => !entry.value)
  .map((entry) => entry.key);

if (missingElements.length > 0) {
  console.error("Missing required DOM elements:", missingElements.join(", "));
} else if (!window.DogApi || !window.DogUI || !window.DogModal) {
  // Safety check: modules must be loaded before this file.
  console.error("Missing required modules: DogApi, DogUI, or DogModal");
} else {
  // Main app state.
  let breedMap = {};
  let allBreedNames = [];
  let currentImages = [];
  let visibleCount = 0;
  const pageSize = 12;

  window.addEventListener("DOMContentLoaded", () => {
    // Initialize modal behavior and load startup data.
    DogModal.setup({
      gallery,
      imageModal,
      modalImage,
      modalClose,
      modalDownload,
    });

    loadBreeds();
    loadBackgroundCollage();
  });

  function resetResultState() {
    // Reset pagination/image state only.
    currentImages = [];
    visibleCount = 0;
  }

  function clearGalleryState() {
    // Reset visible results area and related state.
    DogUI.clearGalleryState({ gallery, statusBox, loadMoreBtn });
    resetResultState();
  }

  function applyBreedFilter() {
    // Live filter for breed dropdown using search text.
    const query = breedSearch.value.trim().toLowerCase();
    const filtered = query
      ? allBreedNames.filter((breedName) => breedName.toLowerCase().includes(query))
      : allBreedNames;

    DogUI.renderBreedOptions(breedSelect, filtered);
    DogUI.renderNoBreedMatches(statusBox, query && filtered.length === 0 ? query : "");
  }

  async function loadBreeds() {
    // Load all breeds for dropdown list.
    DogUI.showSpinner(spinner, true);
    statusBox.textContent = "";

    try {
      const data = await DogApi.loadBreeds();

      if (data.status === "success") {
        breedMap = data.message;
        allBreedNames = Object.keys(breedMap).sort();
        applyBreedFilter();
        DogUI.resetSubBreedOptions(subBreedSelect);
        DogUI.showSpinner(spinner, false);
      } else {
        DogUI.showError(spinner, statusBox, "Failed to load breeds.");
      }
    } catch {
      DogUI.showError(spinner, statusBox, "Error loading breeds.");
    }
  }

  async function loadImagesForSelection() {
    // Load images for currently selected breed/sub-breed.
    const breed = breedSelect.value;
    const subBreed = subBreedSelect.value;

    clearGalleryState();

    if (!breed) {
      return;
    }

    DogUI.showSpinner(spinner, true);

    try {
      const data = await DogApi.loadImages(breed, subBreed);

      if (data.status === "success") {
        currentImages = data.message;
        DogUI.showSpinner(spinner, false);
        DogUI.renderStatusWithSocialLink(statusBox, breed, subBreed);
        visibleCount = DogUI.renderImages(
          gallery,
          loadMoreBtn,
          currentImages,
          visibleCount,
          pageSize
        );
      } else {
        DogUI.showError(spinner, statusBox, "No images found.");
      }
    } catch {
      DogUI.showError(spinner, statusBox, "Error loading images.");
    }
  }

  async function loadBackgroundCollage() {
    // Decorative background images only.
    if (!bgCollage) {
      return;
    }

    try {
      const data = await DogApi.loadBackgroundImages(12);
      if (data.status === "success") {
        renderCollage(data.message);
      }
    } catch {
      // Background is decorative only.
    }
  }

  function renderCollage(urls) {
    // Place random tiles in background collage container.
    const fragment = document.createDocumentFragment();
    const positions = generateCollagePositions(urls.length);

    urls.forEach((url, index) => {
      const tile = document.createElement("div");
      tile.className = "bg-collage__item";
      tile.style.backgroundImage = `url(${url})`;

      const position = positions[index];
      tile.style.top = `${position.top}%`;
      tile.style.left = `${position.left}%`;
      tile.style.transform = `rotate(${position.rotate}deg) scale(${position.scale})`;

      fragment.appendChild(tile);
    });

    bgCollage.innerHTML = "";
    bgCollage.appendChild(fragment);
  }

  function generateCollagePositions(count) {
    // Generate random layout for collage tiles.
    const positions = [];

    for (let index = 0; index < count; index += 1) {
      positions.push({
        top: 5 + Math.random() * 85,
        left: 5 + Math.random() * 85,
        rotate: -7 + Math.random() * 14,
        scale: 0.9 + Math.random() * 0.35,
      });
    }

    return positions;
  }

  breedSearch.addEventListener("input", () => {
    // Search input updates breeds and clears outdated results.
    applyBreedFilter();
    DogUI.resetSubBreedOptions(subBreedSelect);
    clearGalleryState();
  });

  breedSelect.addEventListener("change", async (event) => {
    // Breed change updates sub-breeds and loads images.
    const breed = event.target.value;
    clearGalleryState();

    if (!breed) {
      DogUI.resetSubBreedOptions(subBreedSelect);
      return;
    }

    DogUI.renderSubBreedOptions(subBreedSelect, breedMap, breed);
    await loadImagesForSelection();
  });

  subBreedSelect.addEventListener("change", loadImagesForSelection);

  loadMoreBtn.addEventListener("click", () => {
    // Pagination: show next chunk of already-fetched images.
    visibleCount = DogUI.renderImages(
      gallery,
      loadMoreBtn,
      currentImages,
      visibleCount,
      pageSize
    );
  });
}
