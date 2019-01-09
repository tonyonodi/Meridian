export default (...messages: string[]) => {
  const cons = document.querySelector("#console");
  if (cons) {
    cons.innerHTML = messages.join("<br/>");
  }
};