/* global jQuery: true, module: true */

jQuery = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NumberedStepsView = require('./steps.js');
var models = require('./models.js');
window.jQuery = window.$ = jQuery;
require('bootstrap');

var BaseView = Backbone.View.extend({
    initializeMap: function(layers) {
        this.layers = layers;
        var self = this;
        for (var i = 0; i < this.layers.length; i++) {
            this.layers.at(i).bind('change:visible', self.renderMap);
        }
    },
    onSelectLayer: function(evt) {
        var layerId = jQuery(evt.target).data('id');
        var layer = this.layers.get(layerId);
        layer.set('visible', jQuery(evt.target).is(':checked'));
    },
    renderMap: function() {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers.at(i);
            var $elt = this.$el.find('.map_layer_' + layer.id);
            if ($elt.length < 1) {
                continue;
            }

            var $legend = this.$el.find('.map_legend_' + layer.id);
            if (layer.get('visible')) {
                $elt[0].style.display = '';
                $legend[0].style.display = '';
            } else {
                $elt[0].style.display = 'none';
                $legend[0].style.display = 'none';
            }
        }
    }
});

var IntroView = BaseView.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.template = require('../static/templates/page_one.html');
    },
    render: function() {
        var markup = this.template({'image': './northoralington.jpg'});
        this.$el.html(markup);
        this.$el.show();
        this.trigger('complete', this);
    }
});

var StrategyView = BaseView.extend({
    events: {
        'click .select-layer': 'onSelectLayer',
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'renderMap', 'onSelectLayer',
                  'maybeComplete');

        this.complete = false;
        this.strategies = options.strategies;

        this.initializeMap(options.layers);
        this.template = require('../static/templates/page_two.html');
    },
    render: function() {
        var markup = this.template({
            strategies: this.strategies.toTemplate(),
            layers: this.layers.toTemplate(),
            complete: this.complete});
        this.$el.html(markup);
        this.$el.show();

        this.renderMap();

        this.maybeComplete();
    },
    maybeComplete: function() {
        if (!this.complete) {
            var complete = 0;
            for (var i = 0; i < this.strategies.length; i++) {
                var strategy = this.strategies.at(i);
                if (strategy.get('viewed')) {
                    complete++;
                }
            }
            if (complete === this.strategies.length) {
                this.complete = true;
                this.trigger('complete', this);
            }
        }
    }
});

var RuralHealthOfficeApp = {
    initialize: function(options) {
        var $parent = jQuery('.rural-health-office');

        var data = require('../static/json/layers.json');
        var layers = new models.MapLayerList(data);

        data = require('../static/json/strategies.json');
        var strategies = new models.StrategyList(data);

        var views = [];

        // Step 1
        var page = jQuery('<div></div>');
        $parent.append(page);
        var view = new IntroView({
            el: page
        });
        views.push(view);

        // Step 2
        page = jQuery('<div></div>');
        $parent.append(page);
        view = new StrategyView({
            el: page,
            layers: layers,
            strategies: strategies
        });
        views.push(view);

        this.steps = new NumberedStepsView({
            el: jQuery('.steps'),
            views: views
        });

        jQuery('body').show();
    }
};

module.exports.RuralHealthOfficeApp = RuralHealthOfficeApp;
