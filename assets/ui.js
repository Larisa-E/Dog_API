(function attachUiModule(global) {
  // fill breed dropdown from array data
  function renderBreedOptions(breedSelect, breeds) {
    breedSelect.innerHTML = `<option value="">-- Select breed --</option>`;
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed;
      option.textContent = breed;
      breedSelect.appendChild(option);
    });
  }

  // reset sub-breed dropdown to initial disabled state
  function resetSubBreedOptions(subBreedSelect) {
    subBreedSelect.innerHTML = `<option value="">-- Select sub-breed (optional) --</option>`;
    subBreedSelect.disabled = true;
  }

  // fill sub-breed dropdown when available for selected breed
  function renderSubBreedOptions(subBreedSelect, breedMap, breed) {
    resetSubBreedOptions(subBreedSelect);

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

  // clear visible results and hide pagination button
  function clearGalleryState({ gallery, statusBox, loadMoreBtn }) {
    gallery.innerHTML = "";
    statusBox.textContent = "";
    loadMoreBtn.classList.add("d-none");
  }

  // build hashtag text from breed names
  function toInstagramHashtag(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  // show selected breed info and related external links
  function renderStatusWithSocialLink(statusBox, breed, subBreed) {
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

  // show message when search has zero breed matches
  function renderNoBreedMatches(statusBox, query) {
    statusBox.textContent = query
      ? `No breeds found for "${query}".`
      : "";
  }

  // render next page of image cards; return new visible count
  function renderImages(gallery, loadMoreBtn, images, visibleCount, pageSize) {
    const nextImages = images.slice(visibleCount, visibleCount + pageSize);

    nextImages.forEach((url) => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 col-lg-3";

      const img = document.createElement("img");
      img.src = url;
      img.alt = "Dog image";

      col.appendChild(img);
      gallery.appendChild(col);
    });

    const nextVisibleCount = visibleCount + nextImages.length;

    if (nextVisibleCount < images.length) {
      loadMoreBtn.classList.remove("d-none");
    } else {
      loadMoreBtn.classList.add("d-none");
    }

    return nextVisibleCount;
  }

  // spinner visibility helper
  function showSpinner(spinner, show) {
    spinner.classList.toggle("d-none", !show);
  }

  // error helper shown in status area
  function showError(spinner, statusBox, message) {
    showSpinner(spinner, false);
    statusBox.textContent = message;
  }

  // Expose UI helpers globally for app.js
  global.DogUI = {
    renderBreedOptions,
    resetSubBreedOptions,
    renderSubBreedOptions,
    clearGalleryState,
    renderStatusWithSocialLink,
    renderNoBreedMatches,
    renderImages,
    showSpinner,
    showError,
  };
})(window);
