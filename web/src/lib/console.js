export default s => {
  if (window.location.origin.includes("meridianapp")) {
    return;
  }
  const consoleEl = document.querySelector("#console");
  consoleEl.innerText = s;
};
