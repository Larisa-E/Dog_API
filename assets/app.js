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

// available breeds, loaded images, and pagination settings
let breedMap = {};
let allBreedNames = [];
let currentImages = [];
let visibleCount = 0;
const pageSize = 12;

// load breeds and background
window.addEventListener("DOMContentLoaded", () => {
  loadBreeds();
  loadBackgroundCollage();
});

async function fetchJsonWithFallback(primaryUrl, fallbackUrl) {
  // try local/proxy endpoint first. If it fails, use direct Dog API
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
  // load breed list 
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
      applyBreedFilter();
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
  // breed dropdown list
  breedSelect.innerHTML = `<option value="">-- Select breed --</option>`;
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed;
    breedSelect.appendChild(option);
  });
}

function resetSubBreedOptions() {
  // no sub-breed selected and disabled until breed is chosen
  subBreedSelect.innerHTML = `<option value="">-- Select sub-breed (optional) --</option>`;
  subBreedSelect.disabled = true;
}

function renderSubBreedOptions(breed) {
  // if breed has sub-breeds, enable and fill the second dropdown
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

function applyBreedFilter() {
  // search breed
  const query = breedSearch.value.trim().toLowerCase();
  const filtered = query
    ? allBreedNames.filter((breedName) => breedName.toLowerCase().includes(query))
    : allBreedNames;

  renderBreedOptions(filtered);
}

breedSearch.addEventListener("input", () => {
  // real-time search
  applyBreedFilter();
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
  // when breed changes: clear old content, load sub-breeds, fetch new images
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
  // build result label and external links related to selected breed
  statusBox.innerHTML = "";

  const statusText = document.createElement("span");
  statusText.className = "status-label";
  statusText.textContent = subBreed
    ? `Results: ${breed} / ${subBreed}`
    : `Results: ${breed}`;

  const statusLinks = document.createElement("span");
  statusLinks.className = "status-links";

  const combinedBreed = subBreed ? `${subBreed}${breed}` : `${breed}`;
  const tag = `${toInstagramHashtag(combinedBreed)}puppiesforsale`;
  const dkBreedTag = `${toInstagramHashtag(combinedBreed)}danmark`;
  const dkSaleTag = `${toInstagramHashtag(combinedBreed)}salg`;
  const dkGeneralTag = "hvalpetilsalg";

  const link = document.createElement("a");
  link.href = `https://www.instagram.com/explore/tags/${tag}/`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "status-link";
  link.textContent = `Instagram: #${tag}`;

  const dkIgLink = document.createElement("a");
  dkIgLink.href = `https://www.instagram.com/explore/tags/${dkBreedTag}/`;
  dkIgLink.target = "_blank";
  dkIgLink.rel = "noopener noreferrer";
  dkIgLink.className = "status-link";
  dkIgLink.textContent = `IG DK: #${dkBreedTag}`;

  const dkIgGeneralLink = document.createElement("a");
  dkIgGeneralLink.href = `https://www.instagram.com/explore/tags/${dkGeneralTag}/`;
  dkIgGeneralLink.target = "_blank";
  dkIgGeneralLink.rel = "noopener noreferrer";
  dkIgGeneralLink.className = "status-link";
  dkIgGeneralLink.textContent = `IG DK: #${dkGeneralTag}`;

  const dkIgSaleLink = document.createElement("a");
  dkIgSaleLink.href = `https://www.instagram.com/explore/tags/${dkSaleTag}/`;
  dkIgSaleLink.target = "_blank";
  dkIgSaleLink.rel = "noopener noreferrer";
  dkIgSaleLink.className = "status-link";
  dkIgSaleLink.textContent = `IG DK: #${dkSaleTag}`;

  const dkQueryParts = [
    subBreed ? `${breed} ${subBreed}` : breed,
    "hvalp til salg",
    "Danmark",
  ];
  const dkQuery = dkQueryParts.filter(Boolean).join(" ");
  const dkLink = document.createElement("a");
  dkLink.href = `https://www.google.com/search?q=${encodeURIComponent(dkQuery)}&hl=da&gl=DK`;
  dkLink.target = "_blank";
  dkLink.rel = "noopener noreferrer";
  dkLink.className = "status-link";
  dkLink.textContent = "Denmark: Google search";

  statusBox.appendChild(statusText);
  statusLinks.appendChild(link);
  statusLinks.appendChild(dkIgLink);
  statusLinks.appendChild(dkIgSaleLink);
  statusLinks.appendChild(dkIgGeneralLink);
  statusLinks.appendChild(dkLink);
  statusBox.appendChild(statusLinks);
}

function renderImages() {
  // render next page of images
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

// background
async function loadBackgroundCollage() {
  if (!bgCollage) return;
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random/12");
    const data = await response.json();
    if (data.status === "success") {
      renderCollage(data.message);
    }
  } catch (err) {
  }
}

function renderCollage(urls) {
  // random collage tiles around screen for visual style
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
  // open clicked image in full-size modal
  const target = event.target;
  if (target.tagName === "IMG" && target.src) {
    openImageModal(target.src);
  }
});

function openImageModal(url) {
  // prepare download link for selected image
  modalImage.src = url;

  if (modalDownload) {
    const filename = getDownloadFilename(url);
    modalDownload.href = url;
    modalDownload.setAttribute("download", filename);
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
  // create a safe filename from image URL
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
  // close image when clicking outside that image
  if (event.target === imageModal) {
    closeImageModal();
  }
});

window.addEventListener("keydown", (event) => {
  // close modal with Escape
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
