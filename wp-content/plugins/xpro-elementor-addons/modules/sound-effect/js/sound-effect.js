!(function ($) {
    "use strict";

    $(window).on("elementor/frontend/init", function () {

        if (typeof elementorModules === "undefined" || typeof elementorFrontend === "undefined") {
            return;
        }

        var SoundHandler = elementorModules.frontend.handlers.Base.extend({

            soundInstance: null,
            soundId: null,
            isPlaying: false,

            bindEvents: function () {
                this.run();
            },

            getFxVal: function (key) {
                return this.getElementSettings(key);
            },

            destroySound: function () {

                var element = this.$element[0];

                if (element && element._xproSoundEvents) {
                    element._xproSoundEvents.forEach(function (event) {
                        event.target.removeEventListener(event.type, event.handler);
                    });

                    element._xproSoundEvents = [];
                }

                if (typeof createjs !== "undefined" && createjs.Sound && this.soundInstance) {
                    this.soundInstance.stop();
                    this.soundInstance = null;
                }

                this.isPlaying = false;
            },

            run: function () {

                this.destroySound();

                var $element = this.$element;
                var element = $element[0];

                if (
                    !$element.hasClass("xpro-soundjs-effect-yes") ||
                    typeof createjs === "undefined" ||
                    typeof createjs.Sound === "undefined"
                ) {
                    return;
                }

                var enabled = this.getFxVal("xpro_soundjs_enable") === "yes";
                var audio = this.getFxVal("xpro_soundjs_audio.url");
                var trigger = this.getFxVal("xpro_soundjs_trigger") || "click";
                var volume = parseFloat(this.getFxVal("xpro_soundjs_volume.size")) || 0.7;
                var loop = this.getFxVal("xpro_soundjs_loop") === "yes";
                var triggerClass = this.getFxVal("xpro_soundjs_trigger_class") || "";

                if (!enabled || !audio) {
                    return;
                }

                this.soundId = "xpro_sound_" + this.getID();

                createjs.Sound.alternateExtensions = ["mp3", "ogg", "wav"];

                var self = this;

                function playSound() {

                    if (!createjs.Sound.loadComplete(self.soundId)) {
                        return;
                    }

                    // Always stop any existing instance before starting a new one.
                    if (self.soundInstance) {
                        self.soundInstance.stop();
                        self.soundInstance = null;
                    }

                    self.soundInstance = createjs.Sound.play(self.soundId, {
                        volume: volume,
                        loop: loop ? -1 : 0
                    });

                    self.isPlaying = true;

                    // Reset state automatically once playback finishes on its own
                    // (only relevant for non-looping sounds).
                    self.soundInstance.on("complete", function () {
                        self.isPlaying = false;
                        self.soundInstance = null;
                    });
                }

                function stopSound() {

                    if (self.soundInstance) {
                        self.soundInstance.stop();
                        self.soundInstance = null;
                    }

                    self.isPlaying = false;
                }

                function toggleSound() {
                    if (self.isPlaying) {
                        stopSound();
                    } else {
                        playSound();
                    }
                }

                if (!createjs.Sound.loadComplete(this.soundId)) {

                    createjs.Sound.registerSound({
                        src: audio,
                        id: this.soundId
                    });

                    if (trigger === "load") {
                        createjs.Sound.on("fileload", function (event) {
                            if (event.id === self.soundId) {
                                playSound();
                            }
                        }, null, true);
                    }

                } else if (trigger === "load") {
                    playSound();
                }

                element._xproSoundEvents = [];

                function addEvent(target, type, handler) {

                    target.addEventListener(type, handler);

                    element._xproSoundEvents.push({
                        target: target,
                        type: type,
                        handler: handler
                    });
                }

                switch (trigger) {

                    case "hover":

                        // Play on hover in, stop automatically on hover out.
                        addEvent(element, "mouseenter", playSound);
                        addEvent(element, "mouseleave", stopSound);

                        break;

                    case "click":

                        // First click plays it, clicking again while it's
                        // still playing stops it.
                        addEvent(element, "click", toggleSound);

                        break;

                    case "class":

                        if (!triggerClass) {
                            break;
                        }

                        document.querySelectorAll(triggerClass).forEach(function (el) {
                            addEvent(el, "click", toggleSound);
                        });

                        break;

                    case "load":

                        // Already handled above.
                        break;
                }
            }

        });

        elementorFrontend.hooks.addAction(
            "frontend/element_ready/global",
            function ($scope) {
                elementorFrontend.elementsHandler.addHandler(SoundHandler, {
                    $element: $scope
                });
            }
        );

    });

})(jQuery);