/**
 * Author: Muhammad Zaryaab Shahbaz
 * Email: zariab64@gmail.com
 * Date: 11/15/22
 */
$(function() {
  $(homeAnchor).load("./home.html");
  showCases();

  $(perimeterAnchor).load("./perimeter.html");
  $(compoundAnchor).load("./compound.html");
  $(santaOfficeAnchor).load("./santa_office.html", () => {
    santaModal = new bootstrap.Modal(document.getElementById("santaModal"), {});
  });

  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltips].map(t => new bootstrap.Tooltip(t));

  // TODO: Remove this
  // start();
});
