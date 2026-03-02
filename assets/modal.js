(function attachModalModule(global) {
  // create filename from image URL
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

  // try direct download; if blocked later we fall back to opening new tab
  async function tryBlobDownload(imageUrl) {
    const response = await fetch(imageUrl, { mode: "cors" });
    if (!response.ok) {
      throw new Error("Download fetch failed");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = getDownloadFilename(imageUrl);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  // wire modal open/close + download interactions
  function setup({ gallery, imageModal, modalImage, modalClose, modalDownload }) {
    function openImageModal(url) {
      // show clicked image in modal
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
      // reset modal state and hide it
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

    // click on gallery image => open modal
    gallery.addEventListener("click", (event) => {
      const target = event.target;
      if (target.tagName === "IMG" && target.src) {
        openImageModal(target.src);
      }
    });

    // download button behavior with fallback
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

    // close handlers (button, backdrop, Escape key)
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
  }

  // expose modal setup globally for app.js
  global.DogModal = {
    setup,
  };
})(window);
