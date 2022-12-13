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

  // TODO: Remove this
  // start();
});
