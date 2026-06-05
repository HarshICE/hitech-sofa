const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const filterContainer = document.querySelector(".category-filters");
const galleryGrid = document.getElementById("galleryGrid");
const galleryStatus = document.getElementById("galleryStatus");
const uploadForm = document.getElementById("uploadForm");
const uploadStatus = document.getElementById("uploadStatus");
const uploadCategory = document.getElementById("imageCategory");
const uploadFileInput = document.getElementById("imageFile");
const supabaseStorageConfig =
  window.SUPABASE_STORAGE && typeof window.SUPABASE_STORAGE === "object"
    ? window.SUPABASE_STORAGE
    : null;
let activeCategory = "all";

const heroImages = [

  'https://efobfvnvkpciavnszxtq.supabase.co/storage/v1/object/public/Sofa%20Gallary/Sofa/sofa28.jpg',

  'https://efobfvnvkpciavnszxtq.supabase.co/storage/v1/object/public/Sofa%20Gallary/Beds/bed_back14.jpg',

  'https://efobfvnvkpciavnszxtq.supabase.co/storage/v1/object/public/Sofa%20Gallary/Dining%20Table/dining_table12.jpg',

  'https://efobfvnvkpciavnszxtq.supabase.co/storage/v1/object/public/Sofa%20Gallary/Bedroom%20Chair/bedroom_chair14.jpg'

];

let currentHeroImage = 0;

function rotateHeroImages() {

  const heroBg =
    document.querySelector('.hero-bg');

  heroBg.style.opacity = 0;

  setTimeout(() => {

  heroBg.style.backgroundImage =
    `url('${heroImages[currentHeroImage]}')`;

  heroBg.style.opacity = 1;

  }, 750);

  currentHeroImage =
    (currentHeroImage + 1) %
    heroImages.length;

}

rotateHeroImages();

setInterval(
  rotateHeroImages,
  5000
);

document
  .getElementById('contactForm')
  .addEventListener('submit', async function(e) {

    e.preventDefault();

    const form = e.target;

    const formData = new FormData(form);

    try {

      const response = await fetch(
        'https://formsubmit.co/ajax/sales.hitechsofa@gmail.com',
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      if (result.success === 'true' || result.success) {

        alert(
          'Thank you! Your enquiry has been submitted successfully.'
        );

        form.reset();

      }

    } catch (error) {

      alert(
        'Something went wrong. Please try again.'
      );

      console.error(error);

    }

  });

function toTitleCase(value) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getCategoryLabel(category) {
  return toTitleCase(category);
}

function getNameFromImageUrl(imageUrl) {
  const fileName = decodeURIComponent(imageUrl.split("/").pop() || "Product");
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  return toTitleCase(withoutExtension);
}

function setStatusMessage(statusEl, message, type = "info", linkUrl = "") {
  if (!statusEl) {
    return;
  }

  statusEl.classList.remove("error", "success");

  if (type === "error") {
    statusEl.classList.add("error");
  } else if (type === "success") {
    statusEl.classList.add("success");
  }

  statusEl.textContent = message;

  if (linkUrl) {
    const link = document.createElement("a");
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View uploaded image";
    statusEl.appendChild(document.createTextNode(" "));
    statusEl.appendChild(link);
  }
}

function getConfiguredCategories() {
  if (!supabaseStorageConfig || !Array.isArray(supabaseStorageConfig.categories)) {
    return [];
  }

  const seen = new Set();
  return supabaseStorageConfig.categories
    .filter((category) => typeof category === "string" && category.trim() !== "")
    .map((category) => category.trim())
    .filter((category) => {
      if (seen.has(category)) {
        return false;
      }
      seen.add(category);
      return true;
    });
}

function isSupabaseConfigured() {
  return (
    !!supabaseStorageConfig &&
    typeof supabaseStorageConfig.isConfigured === "function" &&
    supabaseStorageConfig.isConfigured()
  );
}

function getSupabaseClient() {
  if (!supabaseStorageConfig || typeof supabaseStorageConfig.getClient !== "function") {
    return null;
  }

  return supabaseStorageConfig.getClient();
}

function getBucketName() {
  if (!supabaseStorageConfig || typeof supabaseStorageConfig.bucket !== "string") {
    return "";
  }

  return supabaseStorageConfig.bucket.trim();
}

function createGalleryCard(imageUrl, category) {
  const card = document.createElement("article");
  card.className = "sofa-card";
  card.dataset.category = category;

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = getNameFromImageUrl(imageUrl);

  const info = document.createElement("div");
  info.className = "sofa-info";

  const categoryText = document.createElement("p");
  categoryText.textContent = getCategoryLabel(category);

  info.appendChild(categoryText);
  card.appendChild(image);
  card.appendChild(info);

  return card;
}

function applyFilter(selectedCategory) {
  const cards = document.querySelectorAll(".sofa-card[data-category]");
  cards.forEach((card) => {
    const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
    card.classList.toggle("hidden", !isVisible);
  });
}

function updateActiveFilterButtons() {
  if (!filterContainer) {
    return;
  }

  const buttons = filterContainer.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === activeCategory);
  });
}

function createFilterButton(category) {
  const button = document.createElement("button");
  button.className = "filter-btn";
  button.type = "button";
  button.dataset.filter = category;
  button.textContent = category === "all" ? "All" : getCategoryLabel(category);

  button.addEventListener("click", () => {
    activeCategory = category;
    updateActiveFilterButtons();
    applyFilter(activeCategory);
  });

  return button;
}

function renderFilterButtons(categoryList) {
  if (!filterContainer) {
    return;
  }

  if (activeCategory !== "all" && !categoryList.includes(activeCategory)) {
    activeCategory = "all";
  }

  filterContainer.innerHTML = "";
  filterContainer.appendChild(createFilterButton("all"));

  categoryList.forEach((category) => {
    filterContainer.appendChild(createFilterButton(category));
  });

  updateActiveFilterButtons();
}

async function listCategoryFilePaths(client, bucketName, category) {
  const pageSize = 100;
  let offset = 0;
  const filePaths = [];

  while (true) {
    const { data, error } = await client.storage.from(bucketName).list(category, {
      limit: pageSize,
      offset,
      sortBy: { column: "name", order: "asc" }
    });

    if (error) {
      throw new Error(`Could not load ${getCategoryLabel(category)} images: ${error.message}`);
    }

    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    data.forEach((item) => {
      if (!item || typeof item.name !== "string" || item.name.trim() === "") {
        return;
      }

      if (item.id === null) {
        return;
      }

      filePaths.push(`${category}/${item.name}`);
    });

    if (data.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return filePaths;
}

function getPublicUrlForPath(client, bucketName, filePath) {
  const { data } = client.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}

async function getGalleryImagesFromSupabase(client, bucketName, categories) {
  const categoryEntries = await Promise.all(
    categories.map(async (category) => {
      const filePaths = await listCategoryFilePaths(client, bucketName, category);
      const imageUrls = filePaths.map((filePath) => getPublicUrlForPath(client, bucketName, filePath));
      return [category, imageUrls];
    })
  );

  return Object.fromEntries(categoryEntries);
}

async function renderGalleryFromSupabaseStorage() {
  if (!galleryGrid) {
    return;
  }

  setStatusMessage(galleryStatus, "Loading images...");

  if (!isSupabaseConfigured()) {
    galleryGrid.innerHTML = "";
    renderFilterButtons([]);
    setStatusMessage(
      galleryStatus,
      "Supabase is not configured. Update SUPABASE_URL and SUPABASE_ANON_KEY in supabase-config.js.",
      "error"
    );
    return;
  }

  const client = getSupabaseClient();
  const bucketName = getBucketName();
  const categories = getConfiguredCategories();

  if (!client || !bucketName || categories.length === 0) {
    galleryGrid.innerHTML = "";
    renderFilterButtons([]);
    setStatusMessage(
      galleryStatus,
      "Supabase Storage settings are incomplete. Check bucket and categories in supabase-config.js.",
      "error"
    );
    return;
  }

  try {
    const categoryImageMap = await getGalleryImagesFromSupabase(client, bucketName, categories);
    const categoryEntries = Object.entries(categoryImageMap).sort(([a], [b]) => {
      return getCategoryLabel(a).localeCompare(getCategoryLabel(b));
    });
    renderFilterButtons(categoryEntries.map(([category]) => category));

    galleryGrid.innerHTML = "";
    let totalImages = 0;

    categoryEntries.forEach(([category, imageUrls]) => {
      imageUrls.forEach((imageUrl) => {
        galleryGrid.appendChild(createGalleryCard(imageUrl, category));
        totalImages += 1;
      });
    });

    if (totalImages === 0) {
      setStatusMessage(galleryStatus, "No images uploaded yet. Upload your first image from the upload page.");
    } else {
      setStatusMessage(
        galleryStatus,
        `${totalImages} image${totalImages === 1 ? "" : "s"} loaded from Supabase Storage.`,
        "success"
      );
    }

    applyFilter(activeCategory);
  } catch (error) {
    galleryGrid.innerHTML = "";
    renderFilterButtons([]);
    setStatusMessage(galleryStatus, error.message || "Failed to load gallery images.", "error");
  }
}

function sanitizeFileName(fileName) {
  const extensionMatch = fileName.match(/\.[^.]+$/);
  const extension = extensionMatch ? extensionMatch[0].toLowerCase() : "";
  const baseName = extensionMatch ? fileName.slice(0, -extension.length) : fileName;
  const safeBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeBaseName || "image"}${extension}`;
}

function populateUploadCategories() {
  if (!uploadCategory) {
    return;
  }

  const categories = getConfiguredCategories();
  uploadCategory.innerHTML = "";

  if (categories.length === 0) {
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Add categories in supabase-config.js";
    uploadCategory.appendChild(placeholderOption);
    uploadCategory.disabled = true;
    return;
  }

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = getCategoryLabel(category);
    uploadCategory.appendChild(option);
  });

  uploadCategory.disabled = false;
}

async function uploadImageFile(file, category) {
  const client = getSupabaseClient();
  const bucketName = getBucketName();

  if (!client || !bucketName) {
    throw new Error("Supabase Storage settings are incomplete.");
  }

  const safeFileName = sanitizeFileName(file.name);
  const filePath = `${category}/${Date.now()}-${safeFileName}`;

  const { error } = await client.storage.from(bucketName).upload(filePath, file, {
    upsert: false,
    cacheControl: "3600",
    contentType: file.type
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return getPublicUrlForPath(client, bucketName, filePath);
}

async function handleUploadSubmit(event) {
  event.preventDefault();

  if (!uploadFileInput || !uploadCategory) {
    return;
  }

  if (!isSupabaseConfigured()) {
    setStatusMessage(
      uploadStatus,
      "Supabase is not configured. Update SUPABASE_URL and SUPABASE_ANON_KEY in supabase-config.js.",
      "error"
    );
    return;
  }

  const selectedFile = uploadFileInput.files && uploadFileInput.files[0];
  const selectedCategory = uploadCategory.value;

  if (!selectedFile) {
    setStatusMessage(uploadStatus, "Please choose an image file.", "error");
    return;
  }

  if (!selectedFile.type.startsWith("image/")) {
    setStatusMessage(uploadStatus, "Only image files are allowed.", "error");
    return;
  }

  if (!selectedCategory) {
    setStatusMessage(uploadStatus, "Please choose a category.", "error");
    return;
  }

  const submitButton = uploadForm ? uploadForm.querySelector('button[type="submit"]') : null;
  if (submitButton) {
    submitButton.disabled = true;
  }

  setStatusMessage(uploadStatus, "Uploading image to Supabase...");

  try {
    const publicUrl = await uploadImageFile(selectedFile, selectedCategory);
    if (uploadForm) {
      uploadForm.reset();
    }
    setStatusMessage(uploadStatus, "Upload complete. It is now available in the gallery.", "success", publicUrl);
  } catch (error) {
    setStatusMessage(uploadStatus, error.message || "Upload failed.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function initializeUploadPage() {
  if (!uploadForm) {
    return;
  }

  populateUploadCategories();

  if (!isSupabaseConfigured()) {
    setStatusMessage(
      uploadStatus,
      "Configure Supabase credentials in supabase-config.js before uploading images.",
      "error"
    );
  } else {
    setStatusMessage(uploadStatus, "Select a category and image, then click upload.");
  }

  uploadForm.addEventListener("submit", handleUploadSubmit);
}

if (galleryGrid) {
  renderGalleryFromSupabaseStorage();
}

initializeUploadPage();

document.addEventListener(
  'DOMContentLoaded',
  () => {

    document.getElementById('year')
      .textContent =
      new Date().getFullYear();

    loadHeroSlideshow();

  }
);
