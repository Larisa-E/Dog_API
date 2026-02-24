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

let breedMap = {};
let allBreedNames = [];
let currentImages = [];
let visibleCount = 0;
const pageSize = 12;

// Load breeds and decorative collage on page load
window.addEventListener("DOMContentLoaded", () => {
  loadBreeds();
  loadBackgroundCollage();
});

async function fetchJsonWithFallback(primaryUrl, fallbackUrl) {
  try {
    const response = await fetch(primaryUrl);
    if (!response.ok) {
      throw new Error("Primary endpoint failed");
    }
    return await response.json();
  } catch {
    const fallbackResponse = await fetch(fallbackUrl);
    if (!fallbackResponse.ok) {
      throw new Error("Fallback endpoint failed");
    }
    return await fallbackResponse.json();
  }
}

async function loadBreeds() {
  showSpinner(true);
  statusBox.textContent = "";
  try {
    const data = await fetchJsonWithFallback(
      "api/breeds.php",
      "https://dog.ceo/api/breeds/list/all"
    );

    if (data.status === "success") {
      breedMap = data.message;
      allBreedNames = Object.keys(breedMap).sort();
      renderBreedOptions(allBreedNames);
      resetSubBreedOptions();
      showSpinner(false);
    } else {
      showError("Failed to load breeds.");
    }
  } catch (error) {
    showError("Error loading breeds.");
  }
}

function renderBreedOptions(breeds) {
  breedSelect.innerHTML = `<option value="">-- Select breed --</option>`;
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed;
    breedSelect.appendChild(option);
  });
}

function resetSubBreedOptions() {
  subBreedSelect.innerHTML = `<option value="">-- Select sub-breed (optional) --</option>`;
  subBreedSelect.disabled = true;
}

function renderSubBreedOptions(breed) {
  resetSubBreedOptions();

  const subBreeds = breedMap[breed] || [];
  if (subBreeds.length === 0) {
    return;
  }

  subBreeds.forEach((subBreed) => {
    const option = document.createElement("option");
    option.value = subBreed;
    option.textContent = subBreed;
    subBreedSelect.appendChild(option);
  });

  subBreedSelect.disabled = false;
}

breedSearch.addEventListener("input", () => {
  const query = breedSearch.value.toLowerCase();
  const filtered = allBreedNames.filter((b) => b.includes(query));
  renderBreedOptions(filtered);
  resetSubBreedOptions();
  clearGalleryState();
});

function clearGalleryState() {
  gallery.innerHTML = "";
  statusBox.textContent = "";
  currentImages = [];
  visibleCount = 0;
  loadMoreBtn.classList.add("d-none");
}

breedSelect.addEventListener("change", async (e) => {
  const breed = e.target.value;
  clearGalleryState();

  if (!breed) {
    resetSubBreedOptions();
    return;
  }

  renderSubBreedOptions(breed);
  await loadImagesForSelection();
});

subBreedSelect.addEventListener("change", loadImagesForSelection);

async function loadImagesForSelection() {
  const breed = breedSelect.value;
  const subBreed = subBreedSelect.value;

  clearGalleryState();

  if (!breed) {
    return;
  }

  showSpinner(true);
  try {
    const encodedBreed = encodeURIComponent(breed);
    const encodedSubBreed = encodeURIComponent(subBreed);

    const primaryUrl = subBreed
      ? `api/images.php?breed=${encodedBreed}&subBreed=${encodedSubBreed}`
      : `api/images.php?breed=${encodedBreed}`;

    const fallbackUrl = subBreed
      ? `https://dog.ceo/api/breed/${encodedBreed}/${encodedSubBreed}/images`
      : `https://dog.ceo/api/breed/${encodedBreed}/images`;

    const data = await fetchJsonWithFallback(
      primaryUrl,
      fallbackUrl
    );

    if (data.status === "success") {
      currentImages = data.message;
      showSpinner(false);

      renderStatusWithSocialLink(breed, subBreed);
      renderImages();
    } else {
      showError("No images found.");
    }
  } catch (error) {
    showError("Error loading images.");
  }
}

function toInstagramHashtag(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function renderStatusWithSocialLink(breed, subBreed) {
  statusBox.innerHTML = "";

  const statusText = document.createElement("span");
  statusText.textContent = subBreed
    ? `Showing images for: ${breed}/${subBreed}`
    : `Showing images for: ${breed}`;

  const combinedBreed = subBreed ? `${subBreed}${breed}` : `${breed}`;
  const tag = `${toInstagramHashtag(combinedBreed)}puppiesforsale`;

  const link = document.createElement("a");
  link.href = `https://www.instagram.com/explore/tags/${tag}/`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "ms-2";
  link.textContent = `Instagram: #${tag}`;

  statusBox.appendChild(statusText);
  statusBox.appendChild(link);
}

function renderImages() {
  const nextImages = currentImages.slice(visibleCount, visibleCount + pageSize);
  nextImages.forEach((url) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Dog image";

    col.appendChild(img);
    gallery.appendChild(col);
  });

  visibleCount += nextImages.length;

  if (visibleCount < currentImages.length) {
    loadMoreBtn.classList.remove("d-none");
  } else {
    loadMoreBtn.classList.add("d-none");
  }
}

loadMoreBtn.addEventListener("click", renderImages);

// Background collage helpers
async function loadBackgroundCollage() {
  if (!bgCollage) return;
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random/12");
    const data = await response.json();
    if (data.status === "success") {
      renderCollage(data.message);
    }
  } catch (err) {
    // background is decorative; ignore failures
  }
}

function renderCollage(urls) {
  const fragment = document.createDocumentFragment();
  const positions = generateCollagePositions(urls.length);

  urls.forEach((url, index) => {
    const tile = document.createElement("div");
    tile.className = "bg-collage__item";
    tile.style.backgroundImage = `url(${url})`;
    const pos = positions[index];
    tile.style.top = `${pos.top}%`;
    tile.style.left = `${pos.left}%`;
    tile.style.transform = `rotate(${pos.rotate}deg) scale(${pos.scale})`;
    fragment.appendChild(tile);
  });

  bgCollage.innerHTML = "";
  bgCollage.appendChild(fragment);
}

function generateCollagePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i += 1) {
    positions.push({
      top: 5 + Math.random() * 85,
      left: 5 + Math.random() * 85,
      rotate: -7 + Math.random() * 14,
      scale: 0.9 + Math.random() * 0.35,
    });
  }
  return positions;
}

gallery.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "IMG" && target.src) {
    openImageModal(target.src);
  }
});

function openImageModal(url) {
  modalImage.src = url;

  if (modalDownload) {
    const filename = getDownloadFilename(url);
    modalDownload.href = url;
    modalDownload.setAttribute("download", filename);
    // We'll intercept clicks and attempt a blob download. Keeping this link
    // also allows default browser behavior as a fallback.
    modalDownload.removeAttribute("target");
    modalDownload.removeAttribute("rel");
  }

  imageModal.classList.remove("d-none");
  document.body.style.overflow = "hidden";
  imageModal.setAttribute("aria-hidden", "false");
}

function closeImageModal() {
  modalImage.src = "";

  if (modalDownload) {
    modalDownload.href = "#";
    modalDownload.removeAttribute("download");
    modalDownload.removeAttribute("target");
    modalDownload.removeAttribute("rel");
  }

  imageModal.classList.add("d-none");
  document.body.style.overflow = "";
  imageModal.setAttribute("aria-hidden", "true");
}

function getDownloadFilename(imageUrl) {
  try {
    const parsed = new URL(imageUrl);
    const last = parsed.pathname.split("/").filter(Boolean).pop() || "dog.jpg";
    const clean = last.split("?")[0].split("#")[0];
    return clean.includes(".") ? clean : `${clean}.jpg`;
  } catch {
    return "dog.jpg";
  }
}

async function tryBlobDownload(imageUrl) {
  const response = await fetch(imageUrl, { mode: "cors" });
  if (!response.ok) {
    throw new Error("Download fetch failed");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = getDownloadFilename(imageUrl);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

if (modalDownload) {
  modalDownload.addEventListener("click", async (event) => {
    event.preventDefault();

    const imageUrl = modalImage.src;
    if (!imageUrl) return;

    const originalText = modalDownload.textContent;
    modalDownload.classList.add("disabled");
    modalDownload.setAttribute("aria-disabled", "true");
    modalDownload.textContent = "Downloading...";

    try {
      await tryBlobDownload(imageUrl);
    } catch {
      // If CORS blocks blob download, fall back to opening the image so the
      // user can use the browser's Save Image action.
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    } finally {
      modalDownload.classList.remove("disabled");
      modalDownload.removeAttribute("aria-disabled");
      modalDownload.textContent = originalText;
    }
  });
}

modalClose.addEventListener("click", closeImageModal);

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeImageModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.classList.contains("d-none")) {
    closeImageModal();
  }
});

function showSpinner(show) {
  spinner.classList.toggle("d-none", !show);
}

function showError(message) {
  showSpinner(false);
  statusBox.textContent = message;
}
