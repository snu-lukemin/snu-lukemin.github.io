(function () {
    "use strict";

    var iconLabels = {
        "fa-align-justify": "Toggle site navigation",
        "fa-facebook": "Share on Facebook (opens in a new window)",
        "fa-twitter": "Share on X (opens in a new window)",
        "fa-github": "Open GitHub (opens in a new window)",
        "fa-telegram": "Share on Telegram (opens in a new window)",
        "fa-google-plus": "Share on Google Plus (opens in a new window)",
        "fa-weibo": "Share on Weibo (opens in a new window)",
        "fa-instapaper": "Save to Instapaper (opens in a new window)"
    };

    function labelForIcon(icon) {
        if (!icon) return "Page tool";

        var classes = Object.keys(iconLabels);
        for (var i = 0; i < classes.length; i += 1) {
            if (icon.classList.contains(classes[i])) return iconLabels[classes[i]];
        }

        return "Page tool";
    }

    function syncExpandedStates() {
        var book = document.querySelector(".book");
        var sidebar = document.getElementById("site-navigation");
        var sidebarToggle = document.querySelector(".book-header .fa-align-justify");
        var sidebarOpen = Boolean(book && book.classList.contains("with-summary"));

        if (sidebar) {
            if (sidebarOpen) {
                sidebar.removeAttribute("inert");
                sidebar.removeAttribute("aria-hidden");
            } else {
                sidebar.setAttribute("inert", "");
                sidebar.setAttribute("aria-hidden", "true");
            }
        }

        if (sidebarToggle) {
            var sidebarControl = sidebarToggle.closest(".btn");
            sidebarControl.setAttribute("aria-controls", "site-navigation");
            sidebarControl.setAttribute("aria-expanded", String(sidebarOpen));
        }

        document.querySelectorAll(".book-header .toggle-dropdown").forEach(function (control, index) {
            var menu = control.parentElement.querySelector(".dropdown-menu");
            if (!menu) return;

            if (!menu.id) menu.id = "toolbar-menu-" + index;
            control.setAttribute("aria-controls", menu.id);
            control.setAttribute("aria-expanded", String(menu.classList.contains("open")));
        });
    }

    function enhanceToolbar() {
        document.querySelectorAll(".book-header .btn").forEach(function (control) {
            var icon = control.querySelector("i");
            if (icon) icon.setAttribute("aria-hidden", "true");

            if (!(control.getAttribute("aria-label") || "").trim()) {
                control.setAttribute("aria-label", labelForIcon(icon));
            }

            control.setAttribute("role", "button");
        });

        var reduce = document.querySelector(".book-header .font-reduce");
        var enlarge = document.querySelector(".book-header .font-enlarge");
        if (reduce) reduce.setAttribute("aria-label", "Decrease text size");
        if (enlarge) enlarge.setAttribute("aria-label", "Increase text size");

        syncExpandedStates();
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            var openMenu = document.querySelector(".book-header .dropdown-menu.open");
            if (openMenu) {
                var menuControl = openMenu.parentElement.querySelector(".toggle-dropdown");
                openMenu.classList.remove("open");
                syncExpandedStates();
                if (menuControl) menuControl.focus();
                return;
            }

            var book = document.querySelector(".book.with-summary");
            var sidebarControl = document.querySelector(".book-header .fa-align-justify");
            if (book && sidebarControl && window.gitbook && window.gitbook.sidebar) {
                window.gitbook.sidebar.toggle(false);
                syncExpandedStates();
                sidebarControl.closest(".btn").focus();
            }
            return;
        }

        if (event.key !== " ") return;
        if (!(event.target instanceof Element)) return;

        var control = event.target.closest(".book-header a[role='button']");
        if (!control) return;

        event.preventDefault();
        control.click();
    });

    document.addEventListener("click", function () {
        window.setTimeout(syncExpandedStates, 0);
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", enhanceToolbar);
    } else {
        enhanceToolbar();
    }

    new MutationObserver(enhanceToolbar).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    if (window.gitbook && window.gitbook.events) {
        window.gitbook.events.bind("page.change", enhanceToolbar);
    }
}());
