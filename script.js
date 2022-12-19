/**
 * Author: Muhammad Zaryaab Shahbaz
 * Email: zariab64@gmail.com
 * Date: 11/15/22
 */
const makePromise = (anchor, filePath, callback) => {
  return new Promise(resolve => {
    $(anchor).load(filePath, () => {
      if (callback) callback();
      resolve(true);
    });
  });
};

const initPerimeter = () => {
  return makePromise(perimeterAnchor, "./perimeter.html");
};

const initCompound = () => {
  return makePromise(compoundAnchor, "./compound.html");
};

const initSantaOffice = () => {
  return makePromise(santaOfficeAnchor, "./santa_office.html");
};

const initDeerStable = () => {
  return makePromise(deerAnchor, "./deer_stable.html");
};

const initEAOffice = () => {
  return makePromise(eaOfficeAnchor, "./ea_office.html");
};

const initFlag = () => {
  return makePromise(flagAnchor, "./flag.html");
};

$(function() {
  $(homeAnchor).load("./home.html");
  showCases();

  Promise.all([
    initPerimeter(),
    initCompound(),
    initSantaOffice(),
    initDeerStable(),
    initEAOffice(),
    initFlag(),
  ]).then(() => {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltips].map(t => new bootstrap.Tooltip(t));

    // TODO: Remove this
    // $("#interactive-laptop").removeClass("d-none");
  });

  // TODO: Remove this
  // start();
});
