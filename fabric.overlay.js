
(function (global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});

    fabric.Object.prototype.transparentCorners = false;
    fabric.Overlay = fabric.util.createClass(fabric.Rect, {
        type: "overlay",
        initialOverlayParameters: {},
        instantInitialized: !0,
        initialize: function(e, t, n, i, r, o, a) {
            var s = this;
            this.callSuper("initialize", e);
            var l = new fabric.Gradient({
                type: t,
                gradientUnits: "percentage",
                coords: {
                    x1: parseInt(n) / 100,
                    y1: parseInt(r) / 100,
                    x2: parseInt(i) / 100,
                    y2: parseInt(o) / 100
                },
                colorStops: [
                    {
                        color: 'rgb(166,111,213)',
                        offset: 0,
                    },
                    {    
                        color: '#200772',
                        offset: 1,
                    }
                    ]
            });
            // for (var c in a)
            //     l.addColorStop((0,
            //     ze.Z)({}, c, a[c]));
            this.set("fill", l),
            this.initialOverlayParameters = {
                x1: n,
                x2: i,
                y1: r,
                y2: o,
                stops: a
            },
            this.on({
                "internal:new_properties": function(e) {
                    s.canvas.renderAll(),
                    s.fire("internal:overlay_changed")
                }
            })
        },
        fillGradient: function(e, t, n, i, r, o, a, s) {
            var l = new fabric.Gradient({
                type: n,
                coords: {
                    x1: e * (parseInt(i) / 100),
                    y1: t * (parseInt(o) / 100),
                    x2: e * (parseInt(r) / 100),
                    y2: t * (parseInt(a) / 100)
                },
                colorStops: s
            });
            this.set("fill", l)
        },
        convertCoordsToDirection: function() {
            // return vxe.convertCoordsToDirection(this.fill.coords)
            var e = this.fill.coords;
            return 0 === e.x1 && 0 === e.x2 && 0 === e.y1 && e.y2 > 0 ? "vertical" : 0 === e.x1 && e.x2 > 0 && 0 === e.y1 && 0 === e.y2 ? "horizontal" : 0 === e.x1 && e.x2 > 0 && 0 === e.y1 && e.y2 > 0 ? "diagonal" : "horizontal"
        },
        convertDirectionToCoords: function(e) {
            //return vxe.convertDirectionToCoords(e)
            return "vertical" === e ? {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 100
            } : "diagonal" === e ? {
                x1: 0,
                x2: 100,
                y1: 0,
                y2: 100
            } : {
                x1: 0,
                x2: 100,
                y1: 0,
                y2: 0
            }
        }
    });
})(typeof exports !== 'undefined' ? exports : this);