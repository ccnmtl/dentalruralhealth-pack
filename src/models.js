/* global jQuery: true, module: true */

jQuery = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var MapLayer = Backbone.Model.extend({
    defaults: {
        visible: false
    },
    toTemplate: function() {
        return _(this.attributes).clone();
    }
});

var MapLayerList = Backbone.Collection.extend({
    model: MapLayer,
    initialize: function(lst) {
        if (lst !== undefined && lst instanceof Array) {
            for (var i = 0; i < lst.length; i++) {
                var x = new MapLayer(lst[i]);
                this.add(x);
            }
        }
    },
    toTemplate: function() {
        var a = [];
        this.forEach(function(item) {
            a.push(item.toTemplate());
        });
        return a;
    }
});

var Strategy = Backbone.Model.extend({
    defaults: {
        viewed: false,
        selected: false
    },
    toTemplate: function() {
        var json = _.clone(this.attributes);
        json.viewed = this.get('viewed');
        json.selected = this.get('selected');
        return json;
    }
});

var StrategyList = Backbone.Collection.extend({
    model: Strategy,
    initialize: function(lst) {
        if (lst !== undefined && lst instanceof Array) {
            for (var i = 0; i < lst.length; i++) {
                var x = new Strategy(lst[i]);
                this.add(x);
            }
        }
    },
    toTemplate: function() {
        var a = [];
        this.forEach(function(item) {
            a.push(item.toTemplate());
        });
        return a;
    }
});

module.exports.Strategy = Strategy;
module.exports.StrategyList = StrategyList;
module.exports.MapLayerList = MapLayerList;
