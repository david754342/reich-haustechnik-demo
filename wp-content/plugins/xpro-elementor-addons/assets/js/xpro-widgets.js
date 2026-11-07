!(function (e) {
    "use strict";
    let t = {
        init: function () {
            let o = {
                widget: t.BackgroundOverlay,
                "xpro-simple-gallery.default": t.SimpleGallery,
                "xpro-simple-portfolio.default": t.SimplePortfolio,
                "xpro-progress-bar.default": t.ProgressBar,
                "xpro-pie-chart.default": t.PieChart,
                "xpro-line-chart.default": t.LineChart,
                "xpro-counter.default": t.Counter,
                "xpro-social-chat.default": t.SocialChat,
                "xpro-horizontal-menu.default": t.HorizontalMenu,
                "xpro-team.default": t.Team,
                "xpro-before-after.default": t.BeforeAfter,
                "xpro-content-toggle.default": t.ContentToggle,
                "xpro-news-ticker.default": t.NewsTicker,
                "xpro-table.default": t.Table,
                "xpro-icon-box.default": t.IconBox,
                "xpro-post-grid.default": t.PostGrid,
                "xpro-hot-spot.default": t.HotSpot,
                "xpro-image-scroller.default": t.ImageScroller,
                "xpro-horizontal-timeline.default": t.HorizontalTimeline,
                "xpro-contact-form.default": t.ContactForm,
                "xpro-search.default": t.Search,
                "xpro-course-grid.default": t.CourseGrid,
                "xpro-woo-product-grid.default": t.ProductGrid,
                "xpro-hero-slider.default": t.HeroSlider,
            };
            e.each(o, function (e, t) {
                elementorFrontend.hooks.addAction("frontend/element_ready/" + e, t);
            }),
                e("body").on("click.onWrapperLink", "[data-xpro-element-link]", function () {
                    var t,
                        o,
                        i = e(this),
                        n = i.data("xpro-element-link"),
                        r = i.data("id"),
                        a = document.createElement("a");
                    n &&
                        n.url &&
                        (/^https?:\/\//i.test(n.url) || (n.url = "https://" + n.url),
                        (a.id = "xpro-addons-wrapper-link-" + r),
                        (a.href = n.url),
                        (a.target = n.is_external ? "_blank" : "_self"),
                        (a.rel = n.nofollow ? "nofollow noreferer" : ""),
                        (a.style.display = "none"),
                        document.body.appendChild(a),
                        (t = document.getElementById(a.id)).click(),
                        (o = setTimeout(function () {
                            document.body.removeChild(t), clearTimeout(o);
                        })));
                }),
                e("[data-xpro-equal-height]").each(function () {
                    var t = e(this),
                        o = e(this).data("xpro-equal-height");
                    if ("widgets" === o) {
                        let t = e(this).find(".elementor-widget"),
                            o = 0;
                        t.each(function () {
                            o = Math.max(o, e(this).outerHeight());
                        }),
                            t.css({ minHeight: o + "px" });
                    } else {
                        let i = 0;
                        setTimeout(function () {
                            t.find(o).each(function () {
                                i = Math.max(i, e(this).outerHeight());
                            }),
                                t.find(o).css({ minHeight: i + "px" });
                        }, 100);
                    }
                });
        },
        BackgroundOverlay: function (e) {
            e.hasClass("elementor-element-edit-mode") && e.addClass("xpro-widget-bg-overlay");
        },
        getElementSettings: function (e, o) {
            var i = {},
                n = e.data("model-cid");
            if (elementorFrontend.isEditMode() && n) {
                var r = elementorFrontend.config.elements.data[n],
                    a = r.attributes.widgetType || r.attributes.elType,
                    l = elementorFrontend.config.elements.keys[a];
                l ||
                    ((l = elementorFrontend.config.elements.keys[a] = []),
                    jQuery.each(r.controls, function (e, t) {
                        t.frontend_available && l.push(e);
                    })),
                    jQuery.each(r.getActiveControls(), function (e) {
                        -1 !== l.indexOf(e) && (i[e] = r.attributes[e]);
                    });
            } else i = e.data("settings") || {};
            return t.getItems(i, o);
        },
        getItems: function (e, t) {
            if (t) {
                var o = t.split("."),
                    i = o.splice(0, 1);
                if (!o.length) return e[i];
                if (!e[i]) return;
                return this.getItems(e[i], o.join("."));
            }
            return e;
        },
        SimpleGallery: function (o) {
            let i = t.getElementSettings(o),
                n = o.find(".xpro-elementor-gallery-wrapper"),
                r = o.find(".xpro-elementor-gallery-filter > ul"),
                a = r.attr("data-default-filter");
            setTimeout(function () {
                n.cubeportfolio({
                    filters: r,
                    layoutMode: "grid",
                    defaultFilter: a,
                    animationType: i.filter_animation,
                    gridAdjustment: "responsive",
                    mediaQueries: [
                        {
                            width: elementorFrontend.config.breakpoints.lg,
                            cols: i.item_per_row || 3,
                            options: { gapHorizontal: i.margin.size || 0, gapVertical: i.margin.size || 0 },
                        },
                        {
                            width: elementorFrontend.config.breakpoints.md,
                            cols: i.item_per_row_tablet || 2,
                            options: {
                                gapHorizontal: i.margin_tablet.size || 0,
                                gapVertical: i.margin_tablet.size || 0,
                            },
                        },
                        {
                            width: 0,
                            cols: i.item_per_row_mobile || 1,
                            options: {
                                gapHorizontal: i.margin_mobile.size || 0,
                                gapVertical: i.margin_mobile.size || 0,
                            },
                        },
                    ],
                    caption: i.hover_effect || "zoom",
                    displayType: "sequentially",
                    displayTypeSpeed: 80,
                });
            }, 500),
                "none" !== i.popup &&
                    n.lightGallery({
                        pager: !0,
                        addClass: "xpro-gallery-popup-style-" + i.popup,
                        selector: "[data-xpro-lightbox]",
                        thumbnail: "yes" === i.thumbnail,
                        exThumbImage: "data-src",
                        thumbWidth: 130,
                        thumbMargin: 15,
                        closable: !1,
                        showThumbByDefault: "yes" === i.thumbnail_by_default,
                        thumbContHeight: 150,
                        subHtmlSelectorRelative: !0,
                        hideBarsDelay: 99999999,
                        share: "yes" === i.share,
                        download: "yes" === i.download,
                    });
            let l = o.find(".xpro-filter-dropdown-tablet,.xpro-filter-dropdown-mobile"),
                s = o.find('[data-filter="' + a + '"]'),
                p = l.find("li.cbp-filter-item-active").text();
            l.find(".xpro-select-content").text(p || s.text()),
                l.on("click", function () {
                    e(this).toggleClass("active");
                }),
                l.find(".cbp-l-filters-button > li").on("click", function () {
                    l.find(".xpro-select-content").text(e(this).text());
                });
        },
        SimplePortfolio: function (o) {
            let i = t.getElementSettings(o),
                n = o.find(".xpro-elementor-gallery-wrapper"),
                r = o.find(".xpro-elementor-gallery-filter > ul"),
                a = r.attr("data-default-filter");
            u(),
                setTimeout(function () {
                    n.cubeportfolio({
                        filters: r,
                        layoutMode: "grid",
                        defaultFilter: a,
                        animationType: i.filter_animation,
                        gridAdjustment: "responsive",
                        lightboxGallery: !1,
                        mediaQueries: [
                            {
                                width: elementorFrontend.config.breakpoints.lg,
                                cols: i.item_per_row || 3,
                                options: { gapHorizontal: i.margin.size || 0, gapVertical: i.margin.size || 0 },
                            },
                            {
                                width: elementorFrontend.config.breakpoints.md,
                                cols: i.item_per_row_tablet || 2,
                                options: {
                                    gapHorizontal: i.margin_tablet.size || 0,
                                    gapVertical: i.margin_tablet.size || 0,
                                },
                            },
                            {
                                width: 0,
                                cols: i.item_per_row_mobile || 1,
                                options: {
                                    gapHorizontal: i.margin_mobile.size || 0,
                                    gapVertical: i.margin_mobile.size || 0,
                                },
                            },
                        ],
                        caption: i.hover_effect || "zoom",
                        displayType: "sequentially",
                        displayTypeSpeed: 80,
                    });
                }, 500);
            let l = o.find(".xpro-filter-dropdown-tablet,.xpro-filter-dropdown-mobile"),
                s = o.find('[data-filter="' + a + '"]'),
                p = l.find("li.cbp-filter-item-active").text();
            l.find(".xpro-select-content").text(p || s.text()),
                l.on("click", function () {
                    e(this).toggleClass("active");
                }),
                l.find(".cbp-l-filters-button > li").on("click", function () {
                    l.find(".xpro-select-content").text(e(this).text());
                });
            var d = null;
            let c = new TimelineLite();
            function f(t, i) {
                let n = e(t).data("title");
                "false" !== (d = e(t).data("src-preview")) &&
                    (e(t).siblings().removeClass("xpro-preview-demo-item-open"),
                    e(t).addClass("xpro-preview-demo-item-open"),
                    o
                        .find(".xpro-preview .xpro-preview-prev-demo,.xpro-preview .xpro-preview-next-demo")
                        .removeClass("xpro-preview-inactive"),
                    e(t).prev("[data-src-preview]").length <= 0 &&
                        o.find(".xpro-preview .xpro-preview-prev-demo").addClass("xpro-preview-inactive"),
                    e(t).next("[data-src-preview]").length <= 0 &&
                        o.find(".xpro-preview .xpro-preview-next-demo").addClass("xpro-preview-inactive"),
                    o.find(".xpro-preview .xpro-preview-header-info").html(""),
                    n &&
                        o
                            .find(".xpro-preview .xpro-preview-header-info")
                            .append(`<div class="xpro-preview-demo-name">${n}</div>`),
                    o.find(".xpro-preview .xpro-preview-iframe").attr("src", d),
                    e("body").addClass("xpro-preview-active"),
                    o.find(".xpro-preview").addClass("active"));
            }
            function u() {
                o.find(".xpro-preview-demo-item").removeClass("xpro-preview-demo-item-open"),
                    o.find(".xpro-preview .xpro-preview-iframe").removeAttr("src"),
                    e("body").removeClass("xpro-preview-active"),
                    o.find(".xpro-preview").removeClass("active");
            }
            function m() {
                "1" === i.popup_animation &&
                    c.to(o.find(".xpro-portfolio-loader-style-1 li"), {
                        duration: 0.4,
                        scaleX: 1,
                        transformOrigin: "bottom right",
                    }),
                    "2" === i.popup_animation &&
                        c.to(o.find(".xpro-portfolio-loader-style-2 li"), {
                            duration: 0.4,
                            scaleX: 1,
                            transformOrigin: "bottom left",
                        }),
                    setTimeout(function () {
                        "1" === i.popup_animation &&
                            c.to(o.find(".xpro-portfolio-loader-style-1 li"), {
                                duration: 0.4,
                                scaleX: 0,
                                transformOrigin: "bottom left",
                            }),
                            "2" === i.popup_animation &&
                                c.to(o.find(".xpro-portfolio-loader-style-2 li"), {
                                    duration: 0.4,
                                    scaleX: 0,
                                    transformOrigin: "bottom right",
                                });
                    }, 2500);
            }
            c.seek(0).clear(),
                (c = new TimelineLite()),
                o.find(".xpro-preview-iframe").on("load", function () {
                    e(this).addClass("loaded"), e(this).contents().find("html").attr("id", "xpro-portfolio-html-main");
                }),
                o.on("click", ".xpro-preview-type-popup", function (t) {
                    e(t.target).is(".xpro-preview-demo-import-open") || (m(), f(this));
                }),
                o.on("click", ".xpro-preview-type-link", function (t) {
                    let o = "";
                    return "" !== (o = e(this).data("src-preview")) && window.open(o, i.preview_target), !1;
                }),
                o.on("click", ".xpro-preview-type-none", function (e) {
                    return !1;
                }),
                o.on("click", ".xpro-preview-prev-demo", function (e) {
                    var t = o.find(".xpro-preview-demo-item-open").prev("[data-src-preview]");
                    t.length > 0 && (m(), f(t)), e.preventDefault();
                }),
                o.on("click", ".xpro-preview-next-demo", function (e) {
                    var t = o.find(".xpro-preview-demo-item-open").next("[data-src-preview]");
                    t.length > 0 && (m(), f(t)), e.preventDefault();
                }),
                o.on("click", ".xpro-preview-close", function (e) {
                    e.preventDefault(),
                        e.stopPropagation(),
                        m(),
                        setTimeout(function () {
                            u();
                        }, 2e3);
                });
        },
        ProgressBar: function (o) {
            let i = t.getElementSettings(o),
                n = o.find(".xpro-progress-count"),
                r = o.find(".xpro-progress-track");
            o.find(".xpro-progress-bar").waypoint(
                function () {
                    "yes" === i.show_count &&
                        n.animate(
                            { Counter: i.value },
                            {
                                duration: 1e3 * i.duration.size || 3e3,
                                easing: "swing",
                                step: function (t) {
                                    e(this).text(Math.ceil(t)),
                                        e(this)
                                            .parents(".xpro-progress-counter")
                                            .find(".xpro-progress-count-less")
                                            .text(100 - Math.ceil(t));
                                },
                            }
                        ),
                        r.animate({ width: i.value + "%" }, 1e3 * i.duration.size || 3e3);
                },
                { offset: "100%" }
            );
        },
        PieChart: function (o) {
            let i = t.getElementSettings(o);
            o.find(".xpro-pie-chart").easyPieChart({
                scaleColor: "transparent",
                lineWidth: i.chart_bar_size.size,
                lineCap: i.layout,
                barColor: function () {
                    var e = this.renderer.getCtx(),
                        t = this.renderer.getCanvas(),
                        o = e.createLinearGradient(0, 0, t.width, 0);
                    return (
                        o.addColorStop(0, i.bar_color_1 || "#6ec1e4"), o.addColorStop(1, i.bar_color_2 || "#6ec1e4"), o
                    );
                },
                trackColor: i.track_color || "#f5f5f5",
                size: i.chart_size.size,
                rotate: 0,
                animate: 1e3 * i.duration.size || 2e3,
            }),
                o.find(".xpro-pie-chart").waypoint(
                    function () {
                        o.find(".xpro-pie-chart-count").animate(
                            { Counter: i.value },
                            {
                                duration: 1e3 * i.duration.size || 2e3,
                                easing: "swing",
                                step: function (t) {
                                    e(this).text(Math.ceil(t) + "%");
                                },
                            }
                        ),
                            o.find(".xpro-pie-chart").data("easyPieChart").update(i.value);
                    },
                    { offset: "100%" }
                );
        },
        LineChart: function (e) {
            const t = e.find(".xpro-line-chart-js");
            if (!t.length) return;
            const o = t[0];
            o.xproChart instanceof Chart && o.xproChart.destroy();
            const i = o.getContext("2d");
            if (!i) return;
            let n = t.data("settings");
            if ("string" == typeof n)
                try {
                    n = JSON.parse(n);
                } catch (e) {
                    return void console.error("Line Chart JSON Parse Error:", e);
                }
            if (n && n.data && n.data.datasets && 0 !== n.data.datasets.length)
                try {
                    o.xproChart = new Chart(i, n);
                } catch (e) {
                    console.error("Line Chart Creation Error:", e);
                }
            else console.warn("No data available for line chart");
        },
        Counter: function (o) {
            let i = t.getElementSettings(o),
                n = "",
                r = o.find(".xpro-counter-lottie-animation");
            i.lottie_url ? (n = i.lottie_url.url) : i.svg_upload && (n = i.svg_upload.url),
                lottie.loadAnimation({
                    container: r[0],
                    renderer: "svg",
                    loop: i.loop || !0,
                    autoplay: i.autoplay || !0,
                    path: n,
                }),
                "yes" === i.animate_counter &&
                    new Waypoint({
                        element: o.find(".xpro-counter-wrapper")[0],
                        handler: function () {
                            o.find(".xpro-counter-item > .value").animate(
                                { Counter: i.value },
                                {
                                    duration: 1e3 * i.duration.size || 2e3,
                                    easing: "swing",
                                    step: function (t) {
                                        e(this).text(Math.ceil(t));
                                    },
                                }
                            ),
                                this.destroy();
                        },
                        offset: "100%",
                    });
        },
        SocialChat: function (e) {
            let o = t.getElementSettings(e),
                i = e.find(".xpro-social-chat-widget"),
                n = e.find(".xpro-social-chat-main-btn");
            e.find(".xpro-social-chat-channel");
            const r = o.xpro_fab_trigger || "click";
            console.log("Trigger Type:", r),
                console.log("t.xpro_fab_trigger:", o.xpro_fab_trigger),
                "click" === r &&
                    n.on("click", function (e) {
                        e.preventDefault(), i.toggleClass("active");
                    }),
                "hover" === r &&
                    (i.on("mouseenter", function () {
                        i.addClass("active");
                    }),
                    i.on("mouseleave", function () {
                        i.removeClass("active");
                    })),
                jQuery(document).on("click", function (e) {
                    i.is(e.target) || 0 !== i.has(e.target).length || i.removeClass("active");
                });
        },
        HorizontalMenu: function (o) {
            let i = t.getElementSettings(o),
                n = o.find(".xpro-elementor-horizontal-menu-toggler"),
                r = o.find(".xpro-elementor-horizontal-menu-close"),
                a = o.find(".xpro-elementor-horizontal-menu-overlay"),
                l = o.find(".dropdown > a > .xpro-dropdown-menu-toggle");
            if (
                (e(".xpro-elementor-nav-link").on("click", function (e) {
                    r.click();
                }),
                o.find(".dropdown li").each(function (t) {
                    if (e("ul", this).length) {
                        let t = e("ul:first", this);
                        t.offset().left + t.width() <= e(window).width()
                            ? e(this).removeClass("xpro-edge")
                            : e(this).addClass("xpro-edge");
                    }
                }),
                "yes" === i.one_page_navigation)
            ) {
                function s(t = !1) {
                    var n = e(document).scrollTop(),
                        r = i.scroll_offset.size || 100;
                    o.find(".xpro-elementor-horizontal-navbar-nav li").each(function () {
                        let i = e(this),
                            a = i.find(".xpro-elementor-nav-link").attr("href"),
                            l = a.indexOf("#");
                        if (-1 !== l) {
                            let s = e(a.substring(l));
                            t &&
                                s.length &&
                                o
                                    .find(".xpro-elementor-horizontal-navbar-nav li:not(:first-child)")
                                    .removeClass("current_page_item"),
                                s.length &&
                                    s.position().top - r <= n &&
                                    s.position().top + s.height() > n &&
                                    (o
                                        .find(".xpro-elementor-horizontal-navbar-nav li")
                                        .removeClass("current_page_item"),
                                    i.addClass("current_page_item"));
                        }
                    });
                }
                e(".xpro-elementor-nav-link").on("click", function (t) {
                    r.click();
                    let o = e(this).attr("href"),
                        n = o.indexOf("#");
                    if (-1 !== n) {
                        let r = e(o.substring(n));
                        if (r.length) {
                            var a = this.hash;
                            t.stopPropagation(),
                                e("html, body").animate(
                                    { scrollTop: e(r).offset().top - (i.scroll_offset.size || 100) + 20 },
                                    500,
                                    function () {
                                        window.location.hash = a;
                                    }
                                );
                        }
                    }
                }),
                    s(!0),
                    e(document).on("scroll", function () {
                        s();
                    });
            }
            if ("none" !== i.responsive_show) {
                let p = "tablet" === i.responsive_show ? 1025 : 768;
                n.on("click", function (e) {
                    e.preventDefault(),
                        o.find(".xpro-elementor-horizontal-navbar-wrapper").toggleClass("active"),
                        o.find(".xpro-elementor-horizontal-menu-overlay").toggleClass("active");
                }),
                    r.on("click", function (e) {
                        e.preventDefault(),
                            o.find(".xpro-elementor-horizontal-navbar-wrapper").removeClass("active"),
                            o.find(".xpro-elementor-horizontal-menu-overlay").removeClass("active");
                    }),
                    a.on("click", function (t) {
                        t.preventDefault(),
                            o.find(".xpro-elementor-horizontal-navbar-wrapper").removeClass("active"),
                            e(this).removeClass("active");
                    }),
                    l.on("click", function (t) {
                        e(window).width() < p &&
                            (t.preventDefault(),
                            t.stopPropagation(),
                            e(this).parent().toggleClass("active"),
                            e(this).parent().next(".xpro-elementor-dropdown-menu").slideToggle());
                    }),
                    e(window).resize(function () {
                        e(window).width() > p
                            ? o.find(".xpro-elementor-dropdown-menu").show()
                            : o.find(".xpro-elementor-dropdown-menu").hide(),
                            o.find(".xpro-elementor-horizontal-navbar-wrapper").removeClass("active"),
                            o.find(".xpro-elementor-horizontal-menu-overlay").removeClass("active"),
                            o.find(".dropdown > a").removeClass("active");
                    });
            }
        },
        Team: function (o) {
            let i = t.getElementSettings(o);
            if (
                ("3" === i.layout &&
                    o.find(".xpro-team-layout-3").hover(
                        function () {
                            e(this).find(".xpro-team-description").slideDown(200);
                        },
                        function () {
                            e(this).find(".xpro-team-description").slideUp(200);
                        }
                    ),
                "7" === i.layout &&
                    o.find(".xpro-team-layout-7").hover(
                        function () {
                            e(this).find(".xpro-team-description").slideDown(200),
                                e(this).find(".xpro-team-social-list").slideDown(250);
                        },
                        function () {
                            e(this).find(".xpro-team-description").slideUp(200),
                                e(this).find(".xpro-team-social-list").slideUp(250);
                        }
                    ),
                "8" === i.layout &&
                    o.find(".xpro-team-layout-8").hover(
                        function () {
                            e(this).find(".xpro-team-content").slideDown(200);
                        },
                        function () {
                            e(this).find(".xpro-team-content").slideUp(200);
                        }
                    ),
                "9" === i.layout)
            ) {
                let e = o.find(".xpro-team-image > img").height(),
                    t = o.find(".xpro-team-inner-content").height();
                o.find(".xpro-team-inner-content").width(e), o.find(".xpro-team-inner-content").css("left", t + "px");
            }
            "14" === i.layout &&
                o.find(".xpro-team-layout-14").hover(
                    function () {
                        e(this).find(".xpro-team-description").slideDown(200),
                            e(this).find(".xpro-team-social-list").slideDown(250);
                    },
                    function () {
                        e(this).find(".xpro-team-description").slideUp(200),
                            e(this).find(".xpro-team-social-list").slideUp(250);
                    }
                );
        },
        BeforeAfter: function (e) {
            let o = t.getElementSettings(e);
            e.find(".xpro-compare-item").XproCompare({
                default_offset_pct: o.visible_ratio.size / 100 || 0.5,
                orientation: o.orientation,
                is_wiggle: "yes" === o.wiggle,
                wiggle_timeout: o.wiggle ? 1e3 * o.wiggle_timeout.size : 1e3,
                move_on_hover: "yes" === o.mouse_move,
            });
        },
        ContentToggle: function (o) {
            t.getElementSettings(o),
                o.find(".xpro-content-toggle-button").on("click", function (t) {
                    t.preventDefault(), e(this).parents(".xpro-content-toggle-button-wrapper").toggleClass("active");
                });
        },
        NewsTicker: function (o) {
            let i,
                n = t.getElementSettings(o),
                r = o.find(".xpro-news-ticker");
            e(".e-route-panel-editor-content").length && (i = ".elementor-preview-responsive-wrapper"),
                r.owlCarousel({
                    items: 1,
                    smartSpeed: 1e3,
                    loop: !0,
                    nav: !1,
                    dots: !1,
                    mouseDrag: !1,
                    touchDrag: !1,
                    rtl: "rtl" === n.direction,
                    responsiveBaseElement: i,
                    autoplay: "yes" === n.autoplay,
                    autoplayTimeout: "yes" === n.autoplay ? 1e3 * n.autoplay_timeout.size : 3e3,
                    animateOut: "fade" === n.effect && "fadeOut",
                    animateIn: "fade" === n.effect && "fadeIn",
                }),
                o.find(".xpro-news-ticker-next").click(function () {
                    r.trigger("next.owl.carousel", [1e3]),
                        o.find(".xpro-news-ticker-pause").find("i").removeClass("fa-pause"),
                        o.find(".xpro-news-ticker-pause").find("i").addClass("fa-play"),
                        o.find(".xpro-news-ticker-pause").addClass("active"),
                        r.trigger("stop.owl.autoplay");
                }),
                o.find(".xpro-news-ticker-prev").click(function () {
                    r.trigger("prev.owl.carousel", [1e3]),
                        o.find(".xpro-news-ticker-pause").find("i").removeClass("fa-pause"),
                        o.find(".xpro-news-ticker-pause").find("i").addClass("fa-play"),
                        o.find(".xpro-news-ticker-pause").addClass("active"),
                        r.trigger("stop.owl.autoplay");
                }),
                o.find(".xpro-news-ticker-close").click(function () {
                    o.find(".xpro-news-ticker-wrapper").fadeOut("slow");
                });
        },
        Table: function (t) {
            let o = t.find(".xpro-table-head-column-cell");
            t.find(".xpro-table-body-row").each(function (t, i) {
                e(i)
                    .find(".xpro-table-body-row-cell")
                    .each(function (t, i) {
                        e(i).prev().prop("colspan") > 1 &&
                            0 !== e(i).prop("colspan") &&
                            (t += e(i).prev().prop("colspan") - 1),
                            e(i).prepend('<div class="xpro-table-head-column-cell">' + o.eq(t).html() + "</div>");
                    });
            });
        },
        IconBox: function (e) {
            let o = t.getElementSettings(e),
                i = e.find(".elementor-widget-xpro-icon-box"),
                n = e.find(".xpro-box-icon-item"),
                r = "",
                a = e.find("#xpro-icon-box-lottie");
            "" !== o.hover_animation &&
                i.hover(
                    function () {
                        n.addClass("animated " + o.icon_hover_animation);
                    },
                    function () {
                        n.removeClass("animated " + o.icon_hover_animation);
                    }
                ),
                o.lottie_url ? (r = o.lottie_url.url) : o.svg_upload && (r = o.svg_upload.url),
                lottie.loadAnimation({
                    container: a[0],
                    renderer: "svg",
                    loop: o.loop || !0,
                    autoplay: o.autoplay || !0,
                    path: r,
                });
        },
        PostGrid: function (e) {
            let o = t.getElementSettings(e),
                i = e.find(".xpro-post-grid-main");
            e.find(".xpro-post-grid-item"),
                i.cubeportfolio({
                    layoutMode: "grid",
                    gridAdjustment: "responsive",
                    lightboxGallery: !1,
                    mediaQueries: [
                        {
                            width: elementorFrontend.config.breakpoints.lg,
                            cols: o.column_grid || 3,
                            options: { gapHorizontal: o.space_between.size, gapVertical: o.space_between.size },
                        },
                        {
                            width: elementorFrontend.config.breakpoints.md,
                            cols: o.column_grid_tablet || 2,
                            options: {
                                gapHorizontal: o.space_between_tablet.size || 0,
                                gapVertical: o.space_between_tablet.size || 0,
                            },
                        },
                        {
                            width: 0,
                            cols: o.column_grid_mobile || 1,
                            options: {
                                gapHorizontal: o.space_between_mobile.size || 0,
                                gapVertical: o.space_between_mobile.size || 0,
                            },
                        },
                    ],
                    displayType: "default",
                    displayTypeSpeed: 0,
                });
        },
        HotSpot: function (o) {
            t.getElementSettings(o);
            o.find(".xpro-post-grid-main"),
                o.find(".xpro-hotspot-type-click").on("click", function (t) {
                    t.preventDefault(), e(this).find(".xpro-hotspot-tooltip-text").toggleClass("active");
                }),
                setTimeout(function () {
                    var e = o.find(".xpro-hotspot-animations"),
                        t = 0;
                    e.css({ opacity: 0 }),
                        (function o() {
                            e.stop(!0, !0).css({ opacity: 0 });
                            var i = jQuery(e[t]);
                            i.stop(!0, !0).animate({ opacity: 1 }, 500, function () {
                                setTimeout(function () {
                                    i.animate({ opacity: 0 }, 500, function () {
                                        (t = (t + 1) % e.length), o();
                                    });
                                }, 3e3);
                            });
                        })();
                }, 500);
        },
        ImageScroller: function (e) {
            let o = t.getElementSettings(e),
                i = e.find(".xpro-scroll-image-inner"),
                n = e.find(".xpro-image-scroll-img > img"),
                r = 0;
            "mouse-hover" === o.trigger_type &&
                i.imagesLoaded(function () {
                    (r = "vertical" === o.direction_type ? n.height() - i.height() : n.width() - i.width()),
                        "yes" === o.reverse
                            ? (n.css(
                                  "transform",
                                  ("vertical" === o.direction_type ? "translateY" : "translateX") + "( -" + r + "px)"
                              ),
                              i.hover(
                                  function () {
                                      n.css(
                                          "transform",
                                          ("vertical" === o.direction_type ? "translateY" : "translateX") + "(0px)"
                                      );
                                  },
                                  function () {
                                      n.css(
                                          "transform",
                                          ("vertical" === o.direction_type ? "translateY" : "translateX") +
                                              "( -" +
                                              r +
                                              "px)"
                                      );
                                  }
                              ))
                            : i.hover(
                                  function () {
                                      n.css(
                                          "transform",
                                          ("vertical" === o.direction_type ? "translateY" : "translateX") +
                                              "( -" +
                                              r +
                                              "px)"
                                      );
                                  },
                                  function () {
                                      n.css(
                                          "transform",
                                          ("vertical" === o.direction_type ? "translateY" : "translateX") + "(0px)"
                                      );
                                  }
                              );
                });
        },
        HorizontalTimeline: function (o) {
            let i,
                n = t.getElementSettings(o),
                r = o.find(".xpro-horizontal-timeline"),
                a = 767;
            function l() {
                if ("yes" === n.reverse && e(window).width() >= a) {
                    let t = o.find(".xpro-horiz-equal-height > div"),
                        i = 0;
                    t.each(function () {
                        i = Math.max(i, e(this).outerHeight());
                    }),
                        t.parent().css({ minHeight: i + "px" });
                } else {
                    let t = o.find(".xpro-horizontal-timeline-content > div"),
                        i = 0;
                    t.each(function () {
                        i = Math.max(i, e(this).outerHeight());
                    }),
                        t.parent().css({ minHeight: i + "px" });
                    let n = o.find(".xpro-horizontal-timeline-date > div"),
                        r = 0;
                    n.each(function () {
                        r = Math.max(r, e(this).outerHeight());
                    }),
                        n.parent().css({ minHeight: r + "px" });
                }
            }
            e(".e-route-panel-editor-content").length && (i = ".elementor-preview-responsive-wrapper"),
                e(".elementor-editor-active").length && (a = 750),
                r.owlCarousel({
                    loop: "yes" === n.loop,
                    center: "yes" === n.center,
                    nav: "yes" === n.nav,
                    navText: ["", ""],
                    dots: "yes" === n.dots,
                    mouseDrag: "yes" === n.mouse_drag,
                    rtl: "yes" === n.rtl,
                    touchDrag: !0,
                    autoHeight: !1,
                    autoWidth: "yes" === n.custom_width,
                    responsiveBaseElement: i,
                    autoplay: "yes" === n.autoplay,
                    autoplayTimeout: "yes" === n.autoplay ? 1e3 * n.autoplay_timeout.size : 3e3,
                    autoplayHoverPause: !0,
                    smartSpeed: 500,
                    responsive: {
                        0: { items: n.item_per_row_mobile || 1 },
                        768: { items: n.item_per_row_tablet || 1 },
                        1024: { items: n.item_per_row || 2 },
                    },
                }),
                setTimeout(function () {
                    l();
                }, 300),
                e(window).on("resize", function () {
                    setTimeout(function () {
                        l();
                    }, 500);
                });
        },
        ContactForm: function (o) {
            let i = t.getElementSettings(o),
                n = o.find(".xpro-contact-form"),
                r = (o.find(".xpro-contact-form-submit-button"), o.find(".xpro-contact-form-submit-button > i")),
                a = !1,
                l = n.attr("action");
            function s(e) {
                return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            n.on("submit", function (t) {
                t.preventDefault(), r.show();
                let p = n.serializeArray(),
                    d = [],
                    c = !0,
                    f = null,
                    u = "",
                    m = 0;
                return (
                    i.recaptcha && (a = o.find(".g-recaptcha-response").val()),
                    e.each(p, function (e, t) {
                        "" !== t.value &&
                            "g-recaptcha-response" !== t.name &&
                            ((d[m] = {
                                name: o.find("label[for=" + t.name.replaceAll("[]", "") + "]").text() || "",
                                value: t.value,
                            }),
                            m++);
                    }),
                    d.length
                        ? (u = d.map((e) =>
                              Object.entries(e).reduce((e, t, o) => `${e}${o > 0 ? "&&" : ""}${t[0]}=${t[1]}`, "")
                          ))
                        : (c = !1),
                    o.find('.xpro-contact-form-require [required="required"]').each(function (t) {
                        "" === e(this).val() && (c = !1);
                    }),
                    c
                        ? i.recaptcha && !a
                            ? ((f = '<div class="xpro-alert xpro-alert-danger">' + s(i.captcha_message) + "</div>"),
                              o.find(".xpro-contact-form-message").hide().html(f).slideDown(),
                              void r.hide())
                            : (o.find(".xpro-contact-form-message").slideUp(),
                              void e
                                  .ajax({
                                      method: "POST",
                                      url: l,
                                      data: {
                                          postData: JSON.stringify(u),
                                          formName: i.form_name,
                                          formSubject: i.form_subject,
                                          captcha: a,
                                      },
                                  })
                                  .done(function (e) {
                                      e.success
                                          ? ((f =
                                                '<div class="xpro-alert xpro-alert-success">' +
                                                s(i.success_message) +
                                                "</div>"),
                                            o.find(".xpro-contact-form-message").hide().html(f).slideDown())
                                          : ((f =
                                                '<div class="xpro-alert xpro-alert-danger">' +
                                                s(i.error_message) +
                                                "</div>"),
                                            o.find(".xpro-contact-form-message").hide().html(f).slideDown()),
                                          r.hide(),
                                          i.recaptcha && grecaptcha.reset();
                                  }))
                        : ((f = '<div class="xpro-alert xpro-alert-danger">' + s(i.required_field_message) + "</div>"),
                          o.find(".xpro-contact-form-message").hide().html(f).slideDown(),
                          void r.hide())
                );
            });
        },
        Search: function (e) {
            let o = t.getElementSettings(e);
            ("4" === o.layout || "5" === o.layout) &&
                (e.find(".xpro-elementor-search-button").on("click", function (t) {
                    t.preventDefault(),
                        t.stopPropagation(),
                        e.find(".xpro-elementor-search-layout-4 .xpro-elementor-search-inner").fadeIn(400),
                        e.find(".xpro-elementor-search-layout-5 .xpro-elementor-search-inner").slideDown(400);
                }),
                e.find(".xpro-elementor-search-button-close").on("click", function (t) {
                    t.preventDefault(),
                        t.stopPropagation(),
                        e.find(".xpro-elementor-search-layout-4 .xpro-elementor-search-inner").fadeOut(400),
                        e.find(".xpro-elementor-search-layout-5 .xpro-elementor-search-inner").slideUp(400);
                }));
        },
        CourseGrid: function (e) {
            let o = t.getElementSettings(e),
                i = e.find(".xpro-post-grid-main");
            e.find(".xpro-post-grid-item"),
                i.cubeportfolio({
                    layoutMode: "grid",
                    gridAdjustment: "responsive",
                    mediaQueries: [
                        {
                            width: elementorFrontend.config.breakpoints.lg,
                            cols: o.column_grid || 3,
                            options: { gapHorizontal: o.space_between.size, gapVertical: o.space_between.size },
                        },
                        {
                            width: elementorFrontend.config.breakpoints.md,
                            cols: o.column_grid_tablet || 2,
                            options: {
                                gapHorizontal: o.space_between_tablet.size || 0,
                                gapVertical: o.space_between_tablet.size || 0,
                            },
                        },
                        {
                            width: 0,
                            cols: o.column_grid_mobile || 1,
                            options: {
                                gapHorizontal: o.space_between_mobile.size || 0,
                                gapVertical: o.space_between_mobile.size || 0,
                            },
                        },
                    ],
                    displayType: "default",
                    displayTypeSpeed: 0,
                });
        },
        ProductGrid: function (o) {
            let i = t.getElementSettings(o),
                n = o.find(".xpro-woo-product-grid-main");
            o.find(".xpro-woo-product-grid-item"),
                o.find(".xpro-hv-qv-btn").click(function (t) {
                    t.preventDefault();
                    let i = e(this).attr("id"),
                        n = { action: "load_quick_view_product_data", nonce: XproElementorAddons.nonce, id: i };
                    e.ajax({
                        url: XproElementorAddons.ajax_url,
                        type: "post",
                        data: n,
                        dataType: "html",
                        cache: !1,
                        beforeSend: function () {
                            o.find(".xpro-qv-loader-wrapper").css("display", "unset"),
                                o.find(".xpro-qv-popup-wrapper").css("display", "none");
                        },
                        complete: function () {
                            o.find(".xpro-qv-loader-wrapper").css("display", "none"),
                                o.find(".xpro-qv-popup-wrapper").css("display", "unset"),
                                o.find(".xpro-qv-popup-overlay").css({ opacity: "1", visibility: "visible" });
                        },
                        success: function (t) {
                            o.find("#xpro_elementor_fetch_qv_data").html(t),
                                e(".xpro-woo-qv-content-sec .variations_form")
                                    .wc_variation_form()
                                    .find(".variations select:eq(0)")
                                    .trigger("change"),
                                e(".xpro-woo-qv-content-sec .variations_form").trigger("wc_variation_form");
                        },
                    });
                }),
                o.on("click", ".xpro-woo-qv-cross", function (e) {
                    e.preventDefault(),
                        o.find(".xpro-qv-popup-wrapper").css("display", "none"),
                        o.find(".xpro-qv-popup-overlay").css({ opacity: "0", visibility: "hidden" });
                }),
                o.on("click", ".xpro-qv-popup-overlay", function (e) {
                    e.preventDefault(),
                        o.find(".xpro-qv-popup-wrapper").css("display", "none"),
                        o.find(".xpro-qv-popup-overlay").css({ opacity: "0", visibility: "hidden" });
                }),
                e(document).keyup(function (e) {
                    27 === e.keyCode &&
                        (o.find(".xpro-qv-popup-wrapper").css("display", "none"),
                        o.find(".xpro-qv-popup-overlay").css({ opacity: "0", visibility: "hidden" }));
                }),
                o.on("click", "#xpro_elementor_fetch_qv_data .single_add_to_cart_button:not(.disabled)", function (t) {
                    if ((t.preventDefault(), "" !== e(this).parents("form").attr("action")))
                        return (window.location.href = e(this).parents("form").attr("action")), !1;
                    let i = e(this).closest("form");
                    if (!i[0].checkValidity()) return i[0].reportValidity(), !1;
                    let n = e(this),
                        r = e(this).val();
                    if (
                        (e('input[name="variation_id"]').val(),
                        e('input[name="quantity"]').val(),
                        o.find(".woocommerce-grouped-product-list-item").length)
                    ) {
                        let t = e("input.qty"),
                            o = [];
                        e.each(t, function (t, i) {
                            let n = e(this).attr("name");
                            (n = (n = n.replace("quantity[", "")).replace("]", "")),
                                (n = parseInt(n)),
                                e(this).val() && (o[n] = e(this).val());
                        });
                    }
                    let a = i.serialize();
                    n.is(".single_add_to_cart_button") &&
                        (n.removeClass("added"),
                        n.addClass("loading"),
                        e.ajax({
                            url: XproElementorAddons.ajax_url,
                            type: "POST",
                            data:
                                "action=add_cart_single_product_ajax&product_id=" +
                                r +
                                "&nonce=" +
                                XproElementorAddons.nonce +
                                "&" +
                                a,
                            success: function (t) {
                                e(document.body).trigger("wc_fragment_refresh"),
                                    n.removeClass("loading"),
                                    n.addClass("added");
                            },
                        }));
                }),
                n.cubeportfolio({
                    layoutMode: "grid",
                    gridAdjustment: "responsive",
                    mediaQueries: [
                        {
                            width: elementorFrontend.config.breakpoints.lg,
                            cols: i.column_grid || 3,
                            options: { gapHorizontal: i.space_between.size, gapVertical: i.space_between.size },
                        },
                        {
                            width: elementorFrontend.config.breakpoints.md,
                            cols: i.column_grid_tablet || 2,
                            options: {
                                gapHorizontal: i.space_between_tablet.size || 0,
                                gapVertical: i.space_between_tablet.size || 0,
                            },
                        },
                        {
                            width: 0,
                            cols: i.column_grid_mobile || 1,
                            options: {
                                gapHorizontal: i.space_between_mobile.size || 0,
                                gapVertical: i.space_between_mobile.size || 0,
                            },
                        },
                    ],
                    displayType: "default",
                    displayTypeSpeed: 0,
                });
        },
        HeroSlider: function (o) {
            t.getElementSettings(o);
            var i = o.find(".xpro-hero-slider").data("xpro-hero-slider-setting");
            new Swiper(o.find(".xpro-hero-slider")[0], {
                parallax: !0,
                speed: 100 * i.slide_speed,
                spaceBetween: 0,
                effect: i.slide_effect,
                fadeEffect: { crossFade: !0 },
                loop: i.loop,
                autoplay: {
                    enabled: i.autoplay,
                    disableOnInteraction: !0,
                    delay: i.autoplay_timeout ? 1e3 * i.autoplay_timeout : 3e3,
                },
                pagination: { el: o.find(".swiper-pagination")[0], clickable: !0 },
                navigation: { nextEl: o.find(".swiper-button-next")[0], prevEl: o.find(".swiper-button-prev")[0] },
                allowTouchMove: i.mouse_drag,
            }).on("slideChangeTransitionStart", function () {
                var t = this;
                e(t.slides[t.activeIndex])
                    .find("[data-animation]")
                    .each(function () {
                        var o = e(this),
                            i = "animated " + o.data("animation");
                        o
                            .addClass(i)
                            .one(
                                "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                                function () {
                                    o.removeClass(i);
                                }
                            ),
                            e(t.slides).removeClass("xpro-animation-init"),
                            e(t.slides[t.activeIndex]).addClass("xpro-animation-init");
                    });
            });
        },
    };
    e(window).on("elementor/frontend/init", t.init);
})(jQuery, window.elementorFrontend);
