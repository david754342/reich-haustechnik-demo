!(function (e) {
    "use strict";
    e(window).on("elementor/frontend/init", function () {
        if ("undefined" != typeof elementorModules) {
            var t = elementorModules.frontend.handlers.Base.extend({
                    dropInterval: null,
                    bindEvents: function () {
                        this.run();
                    },
                    getFxVal: function (e) {
                        return this.getElementSettings(e);
                    },
                    destroyRipples: function (e) {
                        this.dropInterval && (clearInterval(this.dropInterval), (this.dropInterval = null));
                        try {
                            e.data("ripples") && e.ripples("destroy");
                        } catch (e) {}
                    },
                    run: function () {
                        var t = this.$element;
                        if (
                            (this.destroyRipples(t),
                            t.hasClass("xpro-ripples-effect-enabled") && void 0 !== e.fn.ripples)
                        ) {
                            var r = this.getFxVal("xpro_ripples_resolution.size") || 256,
                                n = this.getFxVal("xpro_ripples_drop_radius.size") || 20,
                                o = this.getFxVal("xpro_ripples_perturbance.size") || 0.03,
                                i = "yes" === this.getFxVal("xpro_ripples_interactive"),
                                s = "yes" === this.getFxVal("xpro_ripples_auto_drops"),
                                a = this.getFxVal("xpro_ripples_auto_drops_interval") || 1e3;
                            try {
                                t.ripples({ resolution: r, dropRadius: n, perturbance: o, interactive: i });
                                var l = t.data("ripples");
                                l && l.$canvas && l.$canvas.addClass("xpro-ripples-container"),
                                    s &&
                                        (this.dropInterval = setInterval(function () {
                                            if (t.is(":visible") && t.data("ripples")) {
                                                var e = Math.random() * t.outerWidth(),
                                                    r = Math.random() * t.outerHeight(),
                                                    n = 20 * Math.random() + 5,
                                                    o = 0.03 + 0.05 * Math.random();
                                                t.ripples("drop", e, r, n, o);
                                            }
                                        }, a));
                            } catch (e) {
                                console.error("Xpro Ripples Error:", e.message);
                            }
                        }
                    },
                }),
                r = function (e) {
                    elementorFrontend.elementsHandler.addHandler(t, { $element: e });
                };
            elementorFrontend.hooks.addAction("frontend/element_ready/widget", r),
                elementorFrontend.hooks.addAction("frontend/element_ready/section", r),
                elementorFrontend.hooks.addAction("frontend/element_ready/column", r),
                elementorFrontend.hooks.addAction("frontend/element_ready/container", r);
        }
    });
})(jQuery);
