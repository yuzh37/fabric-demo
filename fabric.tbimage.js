(function (global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});

    fabric.Object.prototype.transparentCorners = false;

    fabric.TbImage = fabric.util.createClass(fabric.Image, {
        type: "tb-image",
        initialize: function(e) {
            var t = this
            , n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
            , i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
            , r = []
            , o = "locked"in n && n.locked;
            "filters"in n && (r = n.filters,
            delete n.filters),
            this.callSuper("initialize", null, (0,
                QIZ)({
                    type: "tb-image",
                    left: e.left,
                    top: e.top,
                    horizontalAlignment: "left",
                    verticalAlignment: "top",
                    fittingType: "fill",
                    // mask: null,
                    mask: "squircle",
                    maskProperties: {},
                    selectable: !1,
                    evented: !1,
                    hidden: "visible"in n && !n.visible,
                    hoverCursor: "default",
                    strokeWidth: 0,
                    imageProperties: {},
                    locked: o,
                    centeredRotation: !1,
                    perPixelTargetFind: !0,
                    filters: []
                }, n)),
            this.boundaryLimitObject = e,
            this.boundaryLimitObject.hasBorders = !o,
            this.boundaryLimitObject.hasControls = !o,
            this.boundaryLimitObject.selectable = !o,
            this.boundaryLimitObject.evented = !o,
            this.boundaryLimitObject.parent = this,
            this.loadImage(n.imageProperties, (function(e) {
                t.setSrc(e, (function(e) {
                    e.clipPath = new fabric.Rect({
                        width: t.boundaryLimitObject.width,
                        height: t.boundaryLimitObject.height,
                        left: t.boundaryLimitObject.left,
                        top: t.boundaryLimitObject.top,
                        selectable: !1,
                        evented: !1,
                        absolutePositioned: !0,
                        angle: "angle"in n ? n.angle : 0
                    });
                    var o = t.getCenterPoint();
                    t.overlay = new fabric.Overlay({
                        left: o.x,
                        top: o.y,
                        width: e.width,
                        height: e.height,
                        opacity: "opacity"in i ? i.opacity : 0,
                        selectable: !1,
                        evented: !1,
                        originX: "center",
                        originY: "center",
                        visible: !0 === t.visible,
                        locked: !0 === t.locked,
                        angle: "angle"in n ? n.angle : 0
                    },"linear","x1"in i ? i.x1 : 0,"x2"in i ? i.x2 : 0,"y1"in i ? i.y1 : 0,"y2"in i ? i.y2 : 100,"colorStops"in i ? i.colorStops : {
                        0: "#00000000",
                        1: "#00000080"
                    }),
                    t.overlay.overlayEnabled = "opacity"in i,
                    t.overlay.clipPath = e.clipPath,
                    r.length > 0 && (t.filters = r,
                    t.applyFilters()),
                    t.updateFittingType(),
                    t.updateAlignment(),
                    t.updateMask(),
                    t.updateOverlay(),
                    t.instantInitialized = !0,
                    t.fire("element:initialized")
                }
                ))
            }
            )),
            this.on({
                "element:properties_modified": function(e) {
                    t.clipPath.set({
                        top: t.boundaryLimitObject.top,
                        left: t.boundaryLimitObject.left
                    }),
                    t.updateFittingType(),
                    t.updateAlignment(),
                    t.updateMask(),
                    t.updateOverlay(),
                    t.setCoords(),
                    t.canvas && t.canvas.renderAll(),
                    e.stopPropagation || t.pushToHistory("element:properties_modified")
                }
            }),
            this.boundaryLimitObject.on({
                moving: function(e) {
                    t.clipPath.left = t.boundaryLimitObject.left,
                    t.clipPath.top = t.boundaryLimitObject.top,
                    t.updateAlignment(),
                    t.updateMask(),
                    t.updateOverlay(),
                    e && e.recomputeCoords && t.setCoords()
                },
                scaling: function() {
                    t.clipPath.left = t.boundaryLimitObject.left,
                    t.clipPath.top = t.boundaryLimitObject.top,
                    t.clipPath.scaleX = t.boundaryLimitObject.scaleX,
                    t.clipPath.scaleY = t.boundaryLimitObject.scaleY,
                    t.updateFittingType(),
                    t.updateAlignment(),
                    t.updateMask(),
                    t.updateOverlay()
                },
                modified: function(e) {
                    var n = e.action
                    , i = e.pushToHistory
                    , r = void 0 === i || i;
                    switch (n) {
                    case "drag":
                        t.boundaryLimitObject.fire("moving");
                        break;
                    case "scale":
                    case "scaleY":
                    case "scaleX":
                        t.boundaryLimitObject.fire("scaling"),
                        t.setCoords();
                        break;
                    case "rotate":
                        t.boundaryLimitObject.fire("rotating"),
                        t.endRotation()
                    }
                    // r && t.pushToHistory(n)
                }
            })
        },
        updateAlignment: function() {
            var e = this.boundaryLimitObject.getPropertiesFromAlignment(this.verticalAlignment + " " + this.horizontalAlignment);
            this.set({
                originX: e.originX,
                originY: e.originY,
                top: e.top,
                left: e.left
            }),
            this.clipPath.set({
                originX: e.originX,
                originY: e.originY,
                top: e.top,
                left: e.left
            }),
            this.setCoords(),
            this.clipPath.setCoords()
        },
        updateFittingType: function() {
            var e, t = this.boundaryLimitObject.getScaledWidth(), n = this.boundaryLimitObject.getScaledHeight(), i = t / n > this.getScaledWidth() / this.getScaledHeight();
            if ("fill" === this.fittingType)
                e = i ? n / this.height : t / this.width;
            else {
                if ("cover" !== this.fittingType)
                    throw Error("fittingType '" + this.fittingType + "' doesn't exist.");
                e = i ? t / this.width : n / this.height
            }
            this.scaleX = e,
            this.scaleY = e
        },
        updateMask: function() {
            var e = this.clipPath.hasOwnProperty("clipPath") && null !== this.clipPath.clipPath;
            if (["circle", "rounded_corners", "blob", "squircle", "hexagon", "pentagon", "parallelogram"].includes(this.mask)) {
                var t = this;
                "cover" === this.fittingType && (t = this.boundaryLimitObject);
                var n = t.getScaledWidth()
                , i = t.getScaledHeight()
                , r = t.getCenterPoint();
                if ("circle" === this.mask) {
                    var o = {
                        radius: n > i ? i / 2 : n / 2,
                        top: r.y,
                        left: r.x,
                        absolutePositioned: !0,
                        originX: "center",
                        originY: "center",
                        selectable: !1,
                        evented: !1
                    };
                    e && this.clipPath.clipPath instanceof fabric.Circle ? this.clipPath.clipPath.set(o) : this.clipPath.clipPath = new fabric.Circle(o)
                }
                if ("rounded_corners" === this.mask) {
                    var a = "radius"in this.maskProperties ? this.maskProperties.radius : 10
                    , s = {
                        left: r.x,
                        top: r.y,
                        width: n,
                        height: i,
                        radius: a,
                        absolutePositioned: !0,
                        originX: "center",
                        originY: "center",
                        angle: this.angle,
                        selectable: !1,
                        evented: !1
                    };
                    e && this.clipPath.clipPath instanceof fabric.RoundedRect ? this.clipPath.clipPath.set(s) : this.clipPath.clipPath = new fabric.RoundedRect(s)
                }
                if (["blob", "squircle", "hexagon", "pentagon", "parallelogram"].includes(this.mask)) {
                    var l = {
                        name: this.mask,
                        top: r.y,
                        left: r.x,
                        absolutePositioned: !0,
                        originX: "center",
                        originY: "center",
                        selectable: !1,
                        evented: !1
                    }
                    , c = new fabric.Path({
                        blob: "M803.424 604.304c-129.558 202.038-642.354 204.756-770.1 2.718C-93.516 405.89 164.694.908 421.092.002 677.49-.904 932.076 401.36 803.424 604.304Z",
                        squircle: "M200 400c87.639 0 136.359 0 168.18-31.82C400 336.358 400 287.638 400 200c0-87.639 0-136.359-31.82-168.18C336.358 0 287.638 0 200 0 112.361 0 63.641 0 31.82 31.82 0 63.642 0 112.362 0 200c0 87.639 0 136.359 31.82 168.18C63.642 400 112.362 400 200 400Z",
                        hexagon: "M346.41 300 173.205 400 0 300V100L173.205 0 346.41 100z",
                        pentagon: "M397.748 173.23 204.673 2.668a6.668 6.668 0 0 0-8.794-.026L2.284 171.55a6.663 6.663 0 0 0-1.927 7.173L73.691 393.72a6.666 6.666 0 0 0 6.307 4.513h239.696a6.664 6.664 0 0 0 6.3-4.493l73.64-213.336c.88-2.553.14-5.38-1.886-7.173Z",
                        parallelogram: "M89.097 0H400l-88.662 212.308H0z"
                    }[this.mask],l)
                    , u = c._calcDimensions()
                    , d = Math.min(i / u.height, n / u.width);
                    c.set({
                        scaleX: d,
                        scaleY: d
                    }),
                    this.clipPath.clipPath = c
                }
            } else
                e && this.clipPath.set("clipPath", null);
            this.clipPath.setCoords(),
            this.setCoords()
        },
        updateOverlay: function() {
            var e = this;
            "cover" === this.fittingType && (e = this.clipPath);
            var t = e.getScaledWidth()
            , n = e.getScaledHeight()
            , i = e.getCenterPoint();
            this.overlay.set({
                left: i.x,
                top: i.y,
                width: t,
                height: n
            });
            var r = this.overlay.convertCoordsToDirection()
            , o = this.overlay.convertDirectionToCoords(r);
            this.overlay.fillGradient(t, n, "linear", o.x1, o.x2, o.y1, o.y2, this.overlay.fill.colorStops),
            this.overlay.clipPath = this.clipPath,
            this.overlay.setCoords()
        },
        getElementAddedToCanvas: function() {
            return [this, this.overlay, this.boundaryLimitObject]
        },
        loadImage: function(e, t) {
            var n = this
            , i = "./test1.jpg";
            return e && 0 !== Object.keys(e).length ? "mimetype"in e && "payload"in e ? t("data:" + e.mimetype + ";base64," + e.payload) : "link"in e ? void fetch(e.link, {
                cache: "no-cache"
            }).then((function(e) {
                return e.blob()
            }
            )).then((function(r) {
                var o = new FileReader;
                o.addEventListener("load", (function() {
                    var r = o.result
                    , a = r.substring("data:".length, r.indexOf(";base64,"));
                    return Kje.includes(a) ? (n.imageProperties.payload = r.substring(r.indexOf(";base64") + ";base64,".length),
                    n.imageProperties.mimetype = a,
                    t(r)) : (console.error("The file is not an image: ".concat(e.link, " (").concat(a, ")")),
                    t(i))
                }
                ), !1),
                o.addEventListener("error", (function() {
                    return console.error("Error occurred reading file: ".concat(e.link)),
                    t(i)
                }
                )),
                o.readAsDataURL(r)
            }
            )).catch((function(n) {
                return console.error("Error loading the image: " + e.link, n),
                t(i)
            }
            )) : (console.error("Invalid image properties: ", e),
            t(i)) : t(i)
        },
        uploadImage: function(e, t) {
            var n = this;
            this.setSrc(e, (function() {
                var e = new FileReader;
                e.addEventListener("load", (function() {
                    var t = e.result
                    , i = t.substring("data:".length, t.indexOf(";base64,"))
                    , r = t.substring(t.indexOf(";base64") + ";base64,".length);
                    n.imageProperties.payload = r,
                    n.imageProperties.mimetype = i,
                    n.fire("element:properties_modified"),
                    n.canvas && n.canvas.fire("object:properties_modified", {
                        target: n,
                        properties: {
                            imageProperties: Object.assign({}, n.imageProperties)
                        }
                    })
                }
                ), !1),
                e.readAsDataURL(t),
                n.canvas.renderAll()
            }
            ), {
                crossOrigin: "anonymous"
            })
        },
        setFilter: function(e, t) {
            var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
            , i = [];
            e && i.push(fabric.TbImage.computeFilter(e, t));
            var r = this.filters.length !== i.length;
            if (this.filters.length > 0 && i.length > 0) {
                var o = this.filters[0].toObject()
                , a = i[0].toObject();
                if (r = (r = r || a.name !== o.name) || a.properties.length !== o.properties.length,
                a.properties.length === o.properties.length)
                    for (var s in a.properties)
                        r = r || a.properties[s] !== o.properties[s]
            }
            r && (this.filters = i,
            this.applyFilters(),
            this.canvas && this.canvas.renderAll(),
            n && (this.pushToHistory("filter_changed"),
            this.canvas && this.canvas.fire("object:properties_modified", {
                target: this,
                properties: {
                    filters: Object.assign({}, this.filters)
                }
            })))
        },
        fitToFormat: function(e, t) {
            this.updateLeft(0, !1),
            this.updateTop(0, !1),
            this.updateWidth(e, !1),
            this.updateHeight(t, !1),
            this.fire("element:properties_modified"),
            this.canvas && this.canvas.renderAll()
        },
        updateWidth: function(e) {
            var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            this.boundaryLimitObject.set({
                scaleX: 1,
                width: Math.round(e)
            }),
            this.clipPath.set({
                scaleX: 1,
                width: this.boundaryLimitObject.width
            }),
            t && this.fire("element:properties_modified"),
            this.canvas && this.canvas.renderAll()
        },
        updateHeight: function(e) {
            var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            this.boundaryLimitObject.set({
                scaleY: 1,
                height: Math.round(e)
            }),
            this.clipPath.set({
                scaleY: 1,
                height: this.boundaryLimitObject.height
            }),
            t && this.fire("element:properties_modified"),
            this.canvas && this.canvas.renderAll()
        },
        activeOverlay: function(e, t) {
            var n = this.overlay.convertCoordsToDirection() !== t || !this.overlay.overlayEnabled;
            for (var i in this.overlay.fill.colorStops)
                n = (n = n || e[i].color !== this.overlay.fill.colorStops[i].color) || e[i].opacity !== this.overlay.fill.colorStops[i].opacity;
            if (n) {
                var r = this.overlay.convertDirectionToCoords(t);
                this.overlay.fillGradient(this.overlay.width, this.overlay.height, "linear", r.x1, r.x2, r.y1, r.y2, e),
                this.overlay.set("opacity", 1),
                this.overlay.overlayEnabled = !0,
                this.canvas && this.canvas.renderAll(),
                this.pushToHistory("overlay:actived"),
                this.canvas && this.canvas.fire("object:properties_modified", {
                    target: this,
                    properties: {
                        overlay: {
                            colorStops: this.overlay.fill.toObject().colorStops,
                            opacity: this.overlay.opacity,
                            direction: this.overlay.convertCoordsToDirection()
                        }
                    }
                })
            }
        },
        disableOverlay: function() {
            this.overlay.overlayEnabled && (this.overlay.set("opacity", 0),
            this.overlay.overlayEnabled = !1,
            this.canvas && this.canvas.renderAll(),
            this.pushToHistory("overlay:disabled"),
            this.canvas && this.canvas.fire("object:properties_modified", {
                target: this,
                properties: {
                    overlay: {
                        opacity: this.overlay.opacity
                    }
                }
            }))
        },
        hasAbsoluteMask: function() {
            return !!this.clipPath && (!0 === this.clipPath.absolutePositioned || !1 === this.clipPath.absolutePositioned && !0 === this.clipPath.isReversed)
        },
        enableRelativeMaskDuringMultipleMoving: function(e) {
            var t = this;
            this.hasAbsoluteMask() && (this.clipPath.isReversed = !0,
            e.on("moving", (function() {
                var e = t.clipPath.calcTransformMatrix()
                , n = t.calcTransformMatrix();
                t.clipPath.absolutePositioned = !1;
                var i = fabric.util.invertTransform(n)
                , r = fabric.util.multiplyTransformMatrices(i, e)
                , o = fabric.util.multiplyTransformMatrices(t.calcTransformMatrix(), r)
                , a = fabric.util.qrDecompose(o);
                t.clipPath.setPositionByOrigin({
                    x: a.translateX,
                    y: a.translateY
                }, "center", "center"),
                t.clipPath.set(a),
                t.clipPath.setCoords()
            }
            )))
        },
        switchBackToAbsoluteMask: function() {
            this.hasAbsoluteMask() && (this.clipPath.absolutePositioned = !0,
            this.clipPath.isReversed = !1,
            this.clipPath.set({
                top: this.boundaryLimitObject.top,
                left: this.boundaryLimitObject.left
            }),
            this.updateFittingType(),
            this.updateAlignment(),
            this.updateMask(),
            this.updateOverlay(),
            this.setCoords(),
            this.canvas && this.canvas.renderAll())
        },
        toObject: function(e) {
            var t = {};
            return this.overlay && (t.overlay = this.overlay.toObject([].concat((0,
            r.Z)(Sxe), ["overlayEnabled"]))),
            fabric.util.object.extend(this.callSuper("toObject", e), (0,
            Qi.Z)({
                boundaryLimitObject: this.boundaryLimitObject.toObject(Sxe),
                imageProperties: (0,
                Qi.Z)({}, this.imageProperties),
                verticalAlignment: this.verticalAlignment,
                horizontalAlignment: this.horizontalAlignment,
                mask: this.mask,
                fittingType: this.fittingType,
                filters: this.filters.map((function(e) {
                    return e.toObject()
                }
                )),
                maskProperties: (0,
                Qi.Z)({}, this.maskProperties),
                locked: this.locked
            }, t))
        },
        updateFromObject: function(e, t) {
            var n = this;
            e.boundaryLimitObject && (this.boundaryLimitObject.set((0,
            Qi.Z)({}, e.boundaryLimitObject)),
            this.boundaryLimitObject.setCoords(),
            delete e.boundaryLimitObject),
            e.clipPath && (e.clipPath.hasOwnProperty("clipPath") && (this.clipPath.hasOwnProperty("clipPath") && this.clipPath.clipPath && this.clipPath.clipPath.set(e.clipPath.clipPath),
            delete e.clipPath.clipPath),
            this.clipPath.set(e.clipPath),
            delete e.clipPath);
            var i = this.imageProperties.payload !== e.imageProperties.payload;
            i || delete e.imageProperties;
            var r = e.filters;
            if (delete e.filters,
            e.overlay && (e.overlay.hasOwnProperty("clipPath") && delete e.overlay.clipPath,
            this.overlay.set(e.overlay),
            delete e.overlay),
            this.set(e),
            i) {
                var o = "/images/builder/placeholder-image.svg";
                e.imageProperties.mimetype && e.imageProperties.payload && (o = "data:" + e.imageProperties.mimetype + ";base64," + e.imageProperties.payload),
                this.setSrc(o, (function() {
                    n.dirty = !0,
                    n.updateFittingType(),
                    n.updateAlignment(),
                    n.updateMask(),
                    n.updateOverlay(),
                    n.setCoords(),
                    r.length > 0 ? n.setFilter(r[0].name, r[0].properties, !1) : n.filters = [],
                    n.applyFilters(),
                    n.canvas && n.canvas.renderAll(),
                    t()
                }
                ))
            } else
                this.updateFittingType(),
                this.updateAlignment(),
                this.updateMask(),
                this.updateOverlay(),
                this.setCoords(),
                r.length > 0 ? this.setFilter(r[0].name, r[0].properties, !1) : this.filters = [],
                this.applyFilters(),
                t()
        },
        adaptElementToAnotherDimension: function(e, t, n, i) {
            var r = this.boundaryLimitObject.getBoundingRect(!0, !0)
            , o = this.boundaryLimitObject.getScaledWidth()
            , a = this.boundaryLimitObject.getScaledHeight()
            , s = n / e
            , l = i / t
            , c = parseInt(r.left * s)
            , u = parseInt(r.top * l)
            , d = parseInt(o * s)
            , p = parseInt(a * l);
            this.boundaryLimitObject.set({
                left: c,
                top: u,
                width: Math.max(1, d),
                height: Math.max(1, p)
            }),
            this.boundaryLimitObject.setCoords(),
            this.updateWidth(Math.max(1, d)),
            this.updateHeight(Math.max(1, p)),
            r = this.boundaryLimitObject.getBoundingRect(!0, !0),
            o = this.boundaryLimitObject.getScaledWidth(),
            a = this.boundaryLimitObject.getScaledHeight(),
            this.clipPath.set({
                left: r.left,
                top: r.top,
                width: o,
                height: a
            }),
            this.updateFittingType(),
            this.updateAlignment(),
            this.updateMask(),
            this.updateOverlay(),
            this.setCoords()
        },
        adaptElementToPrint: function() {
            !0 === (this.clipPath.hasOwnProperty("clipPath") && null !== this.clipPath.clipPath) && (this.mask = null,
            this.maskProperties = {},
            this.clipPath.set("clipPath", null)),
            this.filters = [],
            this.applyFilters()
        },
        triggerRotation: function(e) {
            if (!this._rotationX && !this._rotationY)
                switch (this._angleOrigin = this.angle,
                this.originY + " " + this.originX) {
                case "top center":
                    this._rotationX = this.aCoords.tl.x + (this.aCoords.tr.x - this.aCoords.tl.x) / 2,
                    this._rotationY = this.aCoords.tl.y + (this.aCoords.tr.y - this.aCoords.tl.y) / 2;
                    break;
                case "top right":
                    this._rotationX = this.aCoords.tr.x,
                    this._rotationY = this.aCoords.tr.y;
                    break;
                case "center right":
                    this._rotationX = this.aCoords.tr.x + (this.aCoords.br.x - this.aCoords.tr.x) / 2,
                    this._rotationY = this.aCoords.tr.y + (this.aCoords.br.y - this.aCoords.tr.y) / 2;
                    break;
                case "bottom right":
                    this._rotationX = this.aCoords.br.x,
                    this._rotationY = this.aCoords.br.y;
                    break;
                case "bottom center":
                    this._rotationX = this.aCoords.bl.x + (this.aCoords.tr.x - this.aCoords.tl.x) / 2,
                    this._rotationY = this.aCoords.bl.y + (this.aCoords.tr.y - this.aCoords.tl.y) / 2;
                    break;
                case "bottom left":
                    this._rotationX = this.aCoords.bl.x,
                    this._rotationY = this.aCoords.bl.y;
                    break;
                case "center left":
                    this._rotationX = this.aCoords.tl.x + (this.aCoords.bl.x - this.aCoords.tl.x) / 2,
                    this._rotationY = this.aCoords.tl.y + (this.aCoords.bl.y - this.aCoords.tl.y) / 2;
                    break;
                case "center center":
                    var t = this.getCenterPoint();
                    this._rotationX = t.x,
                    this._rotationY = t.y;
                    break;
                default:
                    this._rotationX = this.aCoords.tl.x,
                    this._rotationY = this.aCoords.tl.y
                }
            var n = fabric.util.rotatePoint(new fabric.Point(this._rotationX,this._rotationY), this.boundaryLimitObject.getCenterPoint(), fabric.util.degreesToRadians(e - this._angleOrigin));
            this.set({
                angle: e,
                top: n.y,
                left: n.x
            }),
            this.clipPath.set({
                angle: e,
                top: n.y,
                left: n.x
            }),
            this.clipPath.clipPath && this.clipPath.clipPath.set("angle", e),
            this.overlay.set("angle", e),
            this.updateOverlay(),
            this.updateMask(),
            this.canvas && this.canvas.renderAll()
        },
        endRotation: function() {
            this._rotationX = null,
            this._rotationY = null,
            this._angleOrigin = null,
            this.setCoords()
        },
        setAttribute: function(e, t) {
            if (this.boundaryLimitObject && ["left", "top"].includes(e))
                return this.boundaryLimitObject.set(e, t),
                this.boundaryLimitObject.setCoords(),
                void this.boundaryLimitObject.fire("moving", {
                    recomputeCoords: !0
                });
            if ("opacity" !== e)
                this.set(e, t),
                this.setCoords();
            else {
                var n, i = (0,
                rr.Z)(this.getElementAddedToCanvas());
                try {
                    for (i.s(); !(n = i.n()).done; ) {
                        var r = n.value;
                        (r !== this.overlay || this.overlay.overlayEnabled) && r.set(e, t)
                    }
                } catch (cRt) {
                    i.e(cRt)
                } finally {
                    i.f()
                }
            }
        }
    }),
    fabric.TbImage.prototype.synchronizeProperties = function(e) {
        var t = this;
        if ("imageProperties"in e) {
            var n = "data:".concat(e.imageProperties.mimetype, ";base64,").concat(e.imageProperties.payload);
            this.setSrc(n, (function() {
                t.fire("element:properties_modified", {
                    stopPropagation: !0
                })
            }
            ))
        }
        if ("filters"in e) {
            for (var i in e.filters)
                if ("function" === typeof e.filters[i].toObject) {
                    var r = e.filters[i].toObject();
                    this.setFilter(r.name, r.properties)
                }
            delete e.filters
        }
        "overlay"in e && (this.overlay.opacity = e.overlay.opacity,
        e.overlay.opacity > 0 && this.activeOverlay(e.overlay.colorStops, e.overlay.direction),
        delete e.overlay),
        this.updateProperties(e, !0, !0)
    },
    fabric.TbImage.fromObject = function(e, t) {
        var n = new fabric.Boundaries("image_container",e.boundaryLimitObject,!0);
        delete e.boundaryLimitObject,
        delete e.clipPath;
        var i = {};
        if (e.overlay && e.overlay.overlayEnabled) {
            var r, o = {}, a = (0,
            rr.Z)(e.overlay.fill.colorStops);
            try {
                for (a.s(); !(r = a.n()).done; ) {
                    var s = r.value;
                    o[s.offset] = gxe()(s.color).alpha(s.opacity).hex()
                }
            } catch (cRt) {
                a.e(cRt)
            } finally {
                a.f()
            }
            i.opacity = e.overlay.opacity,
            i.colorStops = o,
            i.x1 = e.overlay.fill.coords.x1,
            i.x2 = e.overlay.fill.coords.x2,
            i.y1 = e.overlay.fill.coords.y1,
            i.y2 = e.overlay.fill.coords.y2,
            delete e.overlay
        }
        e.filters && (e.filters = e.filters.map((function(e) {
            return fabric.TbImage.computeFilter(e.name, e.properties)
        }
        )));
        var l = new fabric.TbImage(n,e,i);
        return l.watchInitialization((function() {
            t && t(l)
        }
        )),
        l
    },
    fabric.TbImage.computeFilter = function(e, t) {
        switch (e) {
        case "duotone":
            return new fabric.Image.filters.Duotone({
                primary_color: t[0],
                secondary_color: t[1]
            });
        case "contrast":
            return new fabric.Image.filters.Contrast({
                contrast: parseFloat(parseInt(t[0]) / 256)
            });
        case "grayscale":
            return new fabric.Image.filters.Grayscale({
                grayscale: parseInt(t[0])
            });
        case "saturate":
            return new fabric.Image.filters.Saturation({
                saturation: parseFloat(parseInt(t[0]) / 256)
            });
        default:
            throw new Error("The filter " + e + " is not supported.")
        }
    },
    fabric.TbImage.prototype.watchInitialization = function(e){
        var t = this;
        if (!0 === this.instantInitialized)
            return e(this);
        this.on("element:initialized", (function() {
            return e(t)
        }
        ))
    }
    fabric.TbImage.prototype.updateLeft = function(e) {
        var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        if (this.hasOwnProperty("boundaryLimitObject"))
            this.boundaryLimitObject.set("left", Math.round(e)),
            this.boundaryLimitObject.setCoords();
        else {
            if (!0 === this.lockMovementX)
                return;
            this.set("left", Math.round(e)),
            this.setCoords()
        }
        this.fire("element:properties_modified", {
            stopPropagation: !t
        }),
        this.canvas.renderAll()
    },
    fabric.TbImage.prototype.updateTop = function(e) {
        var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        if (this.hasOwnProperty("boundaryLimitObject"))
            this.boundaryLimitObject.set("top", Math.round(e)),
            this.boundaryLimitObject.setCoords();
        else {
            if (!0 === this.lockMovementY)
                return;
            this.set("top", Math.round(e)),
            this.setCoords()
        }
        this.fire("element:properties_modified", {
            stopPropagation: !t
        }),
        this.canvas.renderAll()
    },
    fabric.TbImage.prototype.moveToPosition = function(e) {
        if (this.canvas) {
            var t = this.canvas.clipPath.width
              , n = this.canvas.clipPath.height
              , i = this;
            if (this.hasOwnProperty("boundaryLimitObject") && (i = this.boundaryLimitObject),
            "left" === e) {
                var r = i.getPositionByOrigin(e, {
                    x: 0,
                    y: i.top
                });
                this.updateLeft(r.x, !1)
            } else if ("top" === e) {
                var o = i.getPositionByOrigin(e, {
                    x: i.left,
                    y: 0
                });
                this.updateTop(o.y, !1)
            } else if ("center" === e) {
                var a = i.getPositionByOrigin(e, {
                    x: Math.round(t / 2),
                    y: i.top
                });
                this.updateLeft(a.x, !1)
            } else if ("right" === e) {
                var s = i.getPositionByOrigin(e, {
                    x: t,
                    y: i.top
                });
                this.updateLeft(s.x, !1)
            } else if ("middle" === e) {
                var l = i.getPositionByOrigin(e, {
                    x: i.left,
                    y: Math.round(n / 2)
                });
                this.updateTop(l.y, !1)
            } else if ("bottom" === e) {
                var c = i.getPositionByOrigin(e, {
                    x: i.left,
                    y: n
                });
                this.updateTop(c.y, !1)
            }
            this.fire("element:properties_modified"),
            this.canvas.renderAll()
        }
    },
    fabric.TbImage.prototype.makeVisible = function() {
        var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        !1 !== this.hidden && (e && this.changeVisibility(!0),
        this.hidden = !1,
        this.fire("element:properties_modified"),
        this.canvas.fire("element:visible", {
            id: this.id,
            visible: !0
        }),
        this.canvas.renderAll())
    },
    fabric.TbImage.prototype.makeInvisible = function() {
        !0 !== this.hidden && (this.changeVisibility(!1),
        this.hidden = !0,
        this.fire("element:properties_modified"),
        this.canvas.fire("element:visible", {
            id: this.id,
            visible: !1
        }),
        this.canvas.discardActiveObject(),
        this.canvas.renderAll())
    },
    fabric.TbImage.prototype.toggleVisibility = function() {
        var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return !1 === this.hidden ? (this.makeInvisible(),
        !1) : (this.makeVisible(e),
        !0)
    },
    fabric.TbImage.prototype.changeVisibility = function() {
        var e, t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], n = (0,
        rr.Z)(this.getElementAddedToCanvas());
        try {
            for (n.s(); !(e = n.n()).done; ) {
                var i = e.value;
                i.set("visible", t)
            }
        } catch (cRt) {
            n.e(cRt)
        } finally {
            n.f()
        }
    },
    fabric.TbImage.prototype.changeVisibilityIfPossible = function() {
        var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        e && this.hidden || (this.changeVisibility(e),
        this.canvas.renderAll())
    }
    fabric.TbImage.prototype.getAttribute = function(e) {
        var t = this;
        return ["left", "top"].includes(e) && this.boundaryLimitObject && (t = this.boundaryLimitObject),
        void 0 === t[e] ? 0 : t[e]
    },
    fabric.TbImage.prototype.setAttribute = function(e, t) {
        if (this.boundaryLimitObject && ["left", "top"].includes(e))
            return this.boundaryLimitObject.set(e, t),
            this.boundaryLimitObject.setCoords(),
            void this.boundaryLimitObject.fire("moving", {
                recomputeCoords: !0
            });
        if ("opacity" !== e)
            this.set(e, t),
            this.setCoords();
        else {
            var n, i = (0,
            rr.Z)(this.getElementAddedToCanvas());
            try {
                for (i.s(); !(n = i.n()).done; ) {
                    n.value.set(e, t)
                }
            } catch (cRt) {
                i.e(cRt)
            } finally {
                i.f()
            }
        }
    },
    fabric.TbImage.prototype.toggleLock = function() {
        var e = this.locked;
        return this.locked = !e,
        this.hasOwnProperty("boundaryLimitObject") ? (this.boundaryLimitObject.selectable = e,
        this.boundaryLimitObject.hasControls = e,
        this.boundaryLimitObject.hasBorders = e,
        this.boundaryLimitObject.evented = e,
        "tb-button" === this.type && (this.text.editable = e,
        this.text.evented = e),
        "tb-text" === this.type && (this.editable = e,
        this.evented = e)) : (this.selectable = e,
        this.hasControls = e,
        this.hasBorders = e,
        this.evented = e),
        this.fire("element:properties_modified"),
        this.canvas.fire("element:locked", {
            id: this.id,
            locked: this.locked
        }),
        this.canvas.renderAll(),
        !0
    }
    //Bje(fabric.TbImage.prototype, [zje, qje, Wje, Gje, Vje]);
})(typeof exports !== 'undefined' ? exports : this);