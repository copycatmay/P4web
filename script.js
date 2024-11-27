// get elements
let container = document.querySelector(".image-container");
let svgObject = document.querySelector("#svg-object");
let navbar = document.querySelector(".navbar");
let navbarHandle = document.querySelector(".navbar-handle");
let downloadBtn = document.querySelector("#download-btn");
let zoomSlider = document.querySelector("#zoom-slider");
let zoomValue = document.querySelector("#zoom-value");

// zoom state
let isZoomed = false;
let zoomLevel = 2.5;

// initialize zoom slider
zoomSlider.value = zoomLevel * 100;
zoomValue.textContent = `${zoomSlider.value}%`;

// wait for svg to load
svgObject.addEventListener("load", function () {
  console.log("SVG loaded");
  let svgDoc = svgObject.contentDocument;
  if (svgDoc) {
    let svgElement = svgDoc.documentElement;
    svgElement.setAttribute("preserveAspectRatio", "xMinYMid meet");
    svgElement.style.pointerEvents = "none";
  } else {
    console.error("Failed to access SVG content.");
  }
});

// handle zoom slider
zoomSlider.addEventListener("input", (e) => {
  zoomLevel = e.target.value / 100;
  zoomValue.textContent = `${e.target.value}%`;
});

// handle zoom click
container.addEventListener("click", (e) => {
  if (!isZoomed) {
    // calculate the point to zoom into (relative to the container)
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // calculate the point relative to the scrolled position
    const pointX = (container.scrollLeft + clickX) / 1; // divide by current scale (1 when not zoomed)
    const pointY = (container.scrollTop + clickY) / 1;

    // apply zoom
    svgObject.style.transform = `scale(${zoomLevel})`;

    // calculate the new scroll position to center on zoom point
    container.scrollLeft = pointX * zoomLevel - clickX;
    container.scrollTop = pointY * zoomLevel - clickY;

    container.style.cursor = "zoom-out";
    zoomSlider.disabled = true;
  } else {
    // reset zoom
    svgObject.style.transform = "scale(1)";
    container.style.cursor = "zoom-in";
    zoomSlider.disabled = false;

    // ensure svg stays constrained
    if (svgObject.contentDocument) {
      let svgElement = svgObject.contentDocument.documentElement;
      svgElement.setAttribute("preserveAspectRatio", "xMinYMid meet");
      svgElement.style.width = "100%";
      svgElement.style.height = "100%";
    }

    // reset scroll position
    container.scrollLeft = 0;
    container.scrollTop = 0;
  }

  isZoomed = !isZoomed;
});

// simplified scroll handling for desktop
window.addEventListener(
  "wheel",
  (e) => {
    if (e.target.closest(".image-container")) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  },
  { passive: false }
);

// toggle navbar
navbarHandle.addEventListener("click", () => {
  navbar.classList.toggle("hidden");
  navbarHandle.classList.toggle("hidden");
});

// add download functionality
downloadBtn.addEventListener("click", () => {
  window.open(svgObject.data, "_blank");
});
