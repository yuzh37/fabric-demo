(function (global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});

    fabric.Object.prototype.transparentCorners = false;

    fabric.Boundaries = fabric.util.createClass(fabric.Rect, {
        type: "boundaries",
        initialize: function() {
            var e = this
              , t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "boundary"
              , n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
              , i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
            //   this.callSuper("initialize", (0,
            //     Qi.Z)({function o(e) {
            this.callSuper("initialize", (0,
                QIZ)({
                lockRotation: !i,
                fill: "transparent",
                stroke: "#FF6961",
                borderColor: "#2F7DF6",
                cornerSize: 7,
                cornerColor: "#FFFFFF",
                cornerStrokeColor: "#2F7DF6",
                transparentCorners: !1,
                strokeWidth: 0,
                strokeDashArray: [2, 2],
                strokeUniform: !0,
                selectable: !0,
                lockScalingFlip: !0,
                hoverCursor: "default",
                forceMinToContainerBBox: !1
            }, n)),
            i || this.setControlVisible("mtr", !1),
            this.label = t.toUpperCase(),
            this.parent = null,
            this.setCoords(),
            this.on({
                modified: function(t) {
                    switch (t.action) {
                    case "drag":
                        null !== e.parent && e.parent.setCoords();
                        break;
                    case "scale":
                    case "scaleY":
                    case "scaleX":
                        e.canvas.renderAll();
                        break;
                    case "rotate":
                        e.parent && e.parent.endRotation()
                    }
                },
                rotating: function() {
                    e.parent && e.parent.triggerRotation(e.angle)
                },
                selected: function() {
                    e.set({
                        stroke: null
                    }),
                    e.parent && e.canvas && (e.parent.set("selected", !0),
                    e.canvas.fire("element:selected", {
                        id: e.parent.id,
                        selected: !0
                    }))
                },
                deselected: function() {
                    e.set({
                        stroke: "#FF6961"
                    }),
                    e.parent && e.canvas && (e.parent.set("selected", !1),
                    e.canvas.fire("element:selected", {
                        id: e.parent.id,
                        selected: !1
                    }))
                },
                scaling: function() {
                    !1 !== e.forceMinToContainerBBox && e.ensureMinDimension()
                },
                mouseover: function() {
                    if (e.parent && !e.parent.selected && !e.canvas.activateDragging && !e.canvas.isTextEditing) {
                        if (e.parent.hasOwnProperty("isTextEditing") && !0 === e.parent.isTextEditing)
                            return;
                        e._renderControls(e.canvas.contextTop, {
                            hasControls: !1
                        }),
                        e.canvas.fire("element:hover", {
                            id: e.parent.id,
                            hover: !0
                        })
                    }
                },
                mouseout: function() {
                    e.parent && e.parent.hasOwnProperty("isTextEditing") && !0 === e.parent.isTextEditing || e.canvas.isTextEditing || (e.canvas.clearContext(e.canvas.contextTop),
                    e.parent && e.canvas.fire("element:hover", {
                        id: e.parent.id,
                        hover: !1
                    }))
                }
            })
        },
        ensureMinDimension: function() {
            var e = this.parent.getBoundingRect(!0, !0)
              , t = this.getBoundingRect(!0, !0);
            e.width > t.width && (this.scaleX = e.width / this.width),
            e.height > t.height && (this.scaleY = e.height / this.height),
            this.setCoords()
        },
        getPropertiesFromAlignment: function(e) {
            this.aCoords || this.setCoords();
            var t, n, i = "left", r = "top";
            switch (e) {
            case "top left":
                t = this.aCoords.tl.x,
                n = this.aCoords.tl.y;
                break;
            case "top right":
                i = "right",
                t = this.aCoords.tr.x,
                n = this.aCoords.tr.y;
                break;
            case "top center":
                i = "center",
                t = this.aCoords.tl.x - (this.aCoords.tl.x - this.aCoords.tr.x) / 2,
                n = this.aCoords.tl.y - (this.aCoords.tl.y - this.aCoords.tr.y) / 2;
                break;
            case "middle left":
                r = "center",
                t = this.aCoords.tl.x - (this.aCoords.tl.x - this.aCoords.bl.x) / 2,
                n = this.aCoords.tl.y - (this.aCoords.tl.y - this.aCoords.bl.y) / 2;
                break;
            case "middle right":
                i = "right",
                r = "center",
                t = this.aCoords.tr.x - (this.aCoords.tr.x - this.aCoords.br.x) / 2,
                n = this.aCoords.tr.y - (this.aCoords.tr.y - this.aCoords.br.y) / 2;
                break;
            case "middle center":
                var o = this.getCenterPoint();
                i = "center",
                r = "center",
                t = o.x,
                n = o.y;
                break;
            case "bottom left":
                r = "bottom",
                t = this.aCoords.bl.x,
                n = this.aCoords.bl.y;
                break;
            case "bottom right":
                i = "right",
                r = "bottom",
                t = this.aCoords.br.x,
                n = this.aCoords.br.y;
                break;
            case "bottom center":
                i = "center",
                r = "bottom",
                t = this.aCoords.bl.x - (this.aCoords.bl.x - this.aCoords.br.x) / 2,
                n = this.aCoords.bl.y - (this.aCoords.bl.y - this.aCoords.br.y) / 2
            }
            return {
                originX: i,
                originY: r,
                left: t,
                top: n
            }
        },
        initFunc: function(e){
            for (var t = 1; t < arguments.length; t++) {
                var n = null != arguments[t] ? arguments[t] : {};
                t % 2 ? r(Object(n), !0).forEach((function(t) {
                    (0, iZ)(e, t, n[t])}
                )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach((function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                }
                ))
            }
            return e
        },
    });
})(typeof exports !== 'undefined' ? exports : this);