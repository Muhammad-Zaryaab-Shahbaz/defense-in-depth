/**
 * Author: Muhammad Zaryaab Shahbaz
 * Email: zariab64@gmail.com
 * Date: 11/15/22
 */
$(function() {
  $(homeAnchor).load("./home.html");
  showCases();

  $(perimeterAnchor).load("./perimeter.html");
  $(compoundAnchor).load("./compound.html", () => {
    workshopModal = new bootstrap.Modal(
      document.getElementById("workshop-status"),
      {}
    );
  });
  $(santaOfficeAnchor).load("./santa_office.html", () => {
    santaModal = new bootstrap.Modal(document.getElementById("santaModal"), {});
  });
  $(deerAnchor).load("./deer_stable.html");

  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltips].map(t => new bootstrap.Tooltip(t));

  // TODO: Remove this
  // start();
});
