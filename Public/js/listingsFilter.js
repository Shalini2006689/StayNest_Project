const searchInput = document.getElementById("listingSearchInput");
const searchForm = document.getElementById("listingSearchForm");
const categoryFilters = document.querySelectorAll(
  "#filters-wrap .filter[data-category]",
);
const listingCards = document.querySelectorAll(".listing-card");
const noListingsMessage = document.getElementById("noListingsMessage");

if (
  searchInput &&
  searchForm &&
  categoryFilters.length > 0 &&
  listingCards.length > 0
) {
  let selectedCategory =
    document.querySelector("#filters-wrap .filter.active")?.dataset.category ||
    "all";

  const applyFilters = () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    listingCards.forEach((card) => {
      const listingLocation = (card.dataset.location || "").toLowerCase();
      const listingCategory = (card.dataset.category || "").toLowerCase();

      const matchesLocation =
        !searchValue || listingLocation.includes(searchValue);
      const matchesCategory =
        selectedCategory === "all" || listingCategory === selectedCategory;

      const shouldShow = matchesLocation && matchesCategory;

      card.classList.toggle("d-none", !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (noListingsMessage) {
      noListingsMessage.classList.toggle("d-none", visibleCount !== 0);
    }
  };

  const updateUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const queryText = searchInput.value.trim();

    if (queryText) params.set("q", queryText);
    else params.delete("q");

    if (selectedCategory !== "all") params.set("category", selectedCategory);
    else params.delete("category");

    const nextUrl = `${window.location.pathname}${params.toString() ? `? ${params.toString()}` : ""}`;

    window.history.replaceState({}, "", nextUrl);
  };

  searchInput.addEventListener("input", () => {
    applyFilters();
    updateUrl();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
    updateUrl();
  });

  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      selectedCategory = (filter.dataset.category || "all").toLowerCase();
      categoryFilters.forEach((item) => item.classList.remove("active"));
      filter.classList.add("active");
      applyFilters();
      updateUrl();
    });
  });

  applyFilters();
}