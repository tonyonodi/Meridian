const isDevServer =
  window.location.hostname.includes("ngrok.io") ||
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("0.0.0.0");

export default (isDevServer
  ? (...messages: string[]) => {
      const cons = document.querySelector("#console");
      if (cons) {
        cons.innerHTML = messages.join(`<br/>`);
      }
    }
  : () => undefined);
