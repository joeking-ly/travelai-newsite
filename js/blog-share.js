(function () {
  var canonical = document.querySelector('link[rel="canonical"]');
  var url = canonical ? canonical.href : window.location.href;
  var title = document.querySelector("h1.hero-title");
  var shareTitle = title ? title.textContent.trim() : document.title;

  function openShare(href) {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=520");
  }

  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var kind = btn.getAttribute("data-share");
      if (kind === "x") {
        openShare(
          "https://twitter.com/intent/tweet?url=" +
            encodeURIComponent(url) +
            "&text=" +
            encodeURIComponent(shareTitle)
        );
        return;
      }
      if (kind === "linkedin") {
        openShare(
          "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url)
        );
        return;
      }
      if (kind === "email") {
        window.location.href =
          "mailto:?subject=" +
          encodeURIComponent(shareTitle) +
          "&body=" +
          encodeURIComponent(url);
        return;
      }
      if (kind === "copy" && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var label = btn.querySelector("span");
          if (!label) return;
          var original = label.textContent;
          label.textContent = "Copied!";
          window.setTimeout(function () {
            label.textContent = original;
          }, 1600);
        });
      }
    });
  });
})();
