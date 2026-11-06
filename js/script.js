/**
 * VOLTA — WEB DE NEGOCIO
 * JavaScript sin dependencias. Cada módulo "init..." se ejecuta aislado con
 * safeRun(): si uno falla, el resto de la página sigue funcionando.
 *
 * Reutilizado de las plantillas anteriores: utilidades de foco y scroll,
 * cabecera y menú móvil (aquí el panel aparece por debajo de 900 px).
 * Nuevo:
 *  - initNeon:    los letreros de las tiendas se encienden al verlos.
 *  - initCircuit: la corriente recorre el cable y enciende las bombillas.
 *  - initTicket:  pone la fecha de hoy en el ticket del precio.
 */
(function () {
  "use strict";

  /**
   * Número de WhatsApp: prefijo de país y número, sin espacios ni "+".
   * Todos los botones de WhatsApp de la página usan este número.
   */
  var WHATSAPP_NUMBER = "34627579975";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    safeRun(setFooterYear);
    safeRun(initHeaderScroll);
    safeRun(initMenu);
    safeRun(initWhatsAppLinks);
    safeRun(initNeon);
    safeRun(initCircuit);
    safeRun(initTicket);
  }

  function safeRun(fn) {
    try {
      fn();
    } catch (error) {
      console.error("[Volta] Error en " + fn.name + ":", error);
    }
  }

  /* =====================================================================
   * Utilidades compartidas
   * =================================================================== */

  var FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  /**
   * Mueve el foco a un elemento de una capa que se acaba de abrir.
   * focus() sobre un elemento con visibility:hidden no hace nada y no da
   * error. Por eso el CSS cambia visibility al instante al abrir (sin
   * transición) y aquí se fuerza el cálculo de estilos antes de enfocar.
   * Si aun así no lo consigue, lo reintenta en el siguiente fotograma.
   */
  function focusWhenVisible(el) {
    if (!el) return;
    void el.offsetHeight;
    el.focus();
    if (document.activeElement !== el) {
      window.requestAnimationFrame(function () {
        el.focus();
      });
    }
  }

  /**
   * Mantiene el foco dentro de un contenedor mientras está abierto.
   * Es lo que convierte una capa "que tapa la pantalla" en un diálogo de
   * verdad: sin esto, con el tabulador te vas a los enlaces de detrás y el
   * lector de pantalla se pierde fuera de la ventana modal.
   * Devuelve una función para desactivarlo.
   */
  function trapFocus(container) {
    function onKeydown(event) {
      if (event.key !== "Tab") return;

      var items = Array.prototype.filter.call(
        container.querySelectorAll(FOCUSABLE),
        function (el) {
          return el.offsetParent !== null || el === document.activeElement;
        }
      );
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeydown);
    return function release() {
      document.removeEventListener("keydown", onKeydown);
    };
  }

  /** Bloquea el scroll del fondo compensando el ancho de la barra para que no "salte". */
  function lockScroll(locked) {
    if (locked) {
      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (gap > 0) document.body.style.paddingRight = gap + "px";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }

  /* =====================================================================
   * Año del pie
   * =================================================================== */
  function setFooterYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = year;
    });
  }

  /* =====================================================================
   * Cabecera: pasa a sólida al bajar
   * =================================================================== */
  function initHeaderScroll() {
    var header = document.getElementById("header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =====================================================================
   * Menú móvil: panel lateral
   * En escritorio la navegación es una barra visible y este módulo no
   * interviene; solo actúa cuando el CSS ha convertido la <nav> en panel.
   * =================================================================== */
  function initMenu() {
    var btn = document.getElementById("menuBtn");
    var nav = document.getElementById("menu");
    var header = document.getElementById("header");
    var backdrop = document.getElementById("navBackdrop");
    if (!btn || !nav || !header || !backdrop) return;

    var label = btn.querySelector("[data-menu-label]");
    // Debe coincidir con la media query del CSS (max-width: 899px)
    var mobile = window.matchMedia("(max-width: 899px)");
    var releaseTrap = null;

    function isOpen() {
      return nav.classList.contains("is-open");
    }

    function open() {
      nav.classList.add("is-open");
      backdrop.hidden = false;
      void backdrop.offsetHeight; // estado inicial para que se vea el fundido
      backdrop.classList.add("is-visible");
      btn.setAttribute("aria-expanded", "true");
      if (label) label.textContent = "Cerrar";
      lockScroll(true);
      // La trampa abarca toda la cabecera: así el botón de cerrar, que está
      // fuera de la <nav>, sigue siendo alcanzable con el tabulador.
      releaseTrap = trapFocus(header);
      focusWhenVisible(nav.querySelector("a[href]"));
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      nav.classList.remove("is-open");
      backdrop.classList.remove("is-visible");
      btn.setAttribute("aria-expanded", "false");
      if (label) label.textContent = "Menú";
      lockScroll(false);
      if (releaseTrap) {
        releaseTrap();
        releaseTrap = null;
      }
      if (returnFocus !== false) btn.focus();

      window.setTimeout(function () {
        if (!isOpen()) backdrop.hidden = true;
      }, 400);
    }

    btn.addEventListener("click", function () {
      if (isOpen()) close();
      else open();
    });

    backdrop.addEventListener("click", function () {
      close();
    });

    nav.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", function () {
        close(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });

    // Si se agranda la ventana con el panel abierto (girar una tablet,
    // por ejemplo), se cierra para no dejar el scroll bloqueado.
    function onBreakpointChange(event) {
      if (!event.matches) close(false);
    }
    if (mobile.addEventListener) mobile.addEventListener("change", onBreakpointChange);
    else if (mobile.addListener) mobile.addListener(onBreakpointChange);
  }

  /**
   * Observa elementos y llama a onVisible la primera vez que aparecen.
   * Si el navegador no tiene IntersectionObserver, los da por vistos.
   */
  function whenVisible(elements, threshold, onVisible) {
    if (!("IntersectionObserver" in window)) {
      elements.forEach(onVisible);
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          onVisible(entry.target);
        });
      },
      { threshold: threshold }
    );
    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* =====================================================================
   * Enlaces de WhatsApp
   * =================================================================== */
  function initWhatsAppLinks() {
    document.querySelectorAll("[data-wa]").forEach(function (link) {
      var text = link.getAttribute("data-wa-message") || "Hola";
      link.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text));
    });
  }

  /* =====================================================================
   * Letreros de neón
   * Cada tienda enciende su letrero cuando entra en pantalla. En el móvil
   * la calle se recorre de lado, así que también cuenta el scroll horizontal
   * (IntersectionObserver mira la pantalla, no la dirección del scroll).
   * =================================================================== */
  function initNeon() {
    var shops = Array.prototype.slice.call(document.querySelectorAll(".shop"));
    if (!shops.length) return;

    if (reduceMotion) {
      shops.forEach(function (shop) { shop.classList.add("is-lit"); });
      return;
    }

    whenVisible(shops, 0.45, function (shop) {
      // Un pequeño retraso distinto en cada una: no se encienden todas a la vez
      var delay = 120 + Math.round(Math.random() * 380);
      window.setTimeout(function () {
        shop.classList.add("is-lit");
      }, delay);
    });
  }

  /* =====================================================================
   * Cómo funciona: la corriente enciende las bombillas una tras otra
   * (los retrasos de cada bombilla están en el CSS)
   * =================================================================== */
  function initCircuit() {
    var circuit = document.querySelector("[data-circuit]");
    if (!circuit) return;
    whenVisible([circuit], 0.35, function (el) {
      el.classList.add("is-on");
    });
  }

  /* =====================================================================
   * Fecha del ticket
   * =================================================================== */
  function initTicket() {
    var el = document.querySelector("[data-ticket-date]");
    if (!el) return;
    el.textContent = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
  }
})();
