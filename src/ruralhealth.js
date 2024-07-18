/* global module: true */

var jQuery = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NumberedStepsView = require('./steps.js');
var models = require('./models.js');
window.jQuery = window.$ = jQuery;
require('bootstrap');

var BaseView = Backbone.View.extend({
    initializeResponses: function(responses) {
        this.responses = responses;
    },
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
    },
    onShowStrategy: function(evt) {
        var dataId = jQuery(evt.target).data('id');
        this.visibleStrategy = this.strategies.get(dataId);

        var ctx = this.visibleStrategy.toTemplate();
        ctx.showProsAndCons = this.showProsAndCons;
        var markup = this.strategyTemplate(ctx);

        var $modal = this.$el.find('#strategy-modal');
        $modal.find('.modal-body').html(markup);
        $modal.modal({show_pros_cons: false});
    },
    onHideStrategy: function(evt) {
        this.visibleStrategy.set('viewed', true);
    },
    isFormComplete: function(form) {
        var self = this;
        var valid = true;

        var children = jQuery(form).find('input,textarea,select');
        jQuery.each(children, function() {
            if (valid && jQuery(this).is(':visible')) {
                var value;
                if (this.tagName === 'INPUT' && this.type === 'text' ||
                        this.tagName === 'TEXTAREA') {
                    value = jQuery(this).val().trim();
                    valid = value.length > 0;
                }

                if (this.tagName === 'SELECT') {
                    value = jQuery(this).val();
                    valid = value !== undefined && value.length > 0 &&
                        jQuery(this).val().trim() !== '-----';
                }

                if (this.type === 'checkbox' || this.type === 'radio') {
                    // one in the group needs to be checked
                    var selector =
                        'input[name=' + jQuery(this).attr('name') + ']:checked';
                    value = jQuery(selector).val();
                    valid = value !== undefined;
                }

                if (valid) {
                    self.responses[jQuery(this).attr('name')] = value;
                }
            }
        });

        if (!valid) {
            alert('Please complete all form fields before continuing.');
        }

        return valid;
    }
});

var IntroView = BaseView.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.template = require('../static/templates/page_one.html');
    },
    render: function() {
        var markup = this.template({
            'image': './northoralington.jpg'
        });
        this.$el.html(markup);
        this.$el.show();
        this.trigger('complete', this);
    }
});

var StrategyView = BaseView.extend({
    events: {
        'click .select-layer': 'onSelectLayer',
        'click .strategy-state': 'onShowStrategy',
        'hidden.bs.modal #strategy-modal': 'onHideStrategy',
    },
    initialize: function(options) {
        _.bindAll(
            this, 'render', 'renderMap', 'onSelectLayer',
            'onShowStrategy', 'onHideStrategy', 'maybeComplete');

        this.complete = false;
        this.strategies = options.strategies;

        this.initializeMap(options.layers);
        this.template = require('../static/templates/page_two.html');
        this.strategyTemplate = require('../static/templates/strategy.html');

        var self = this;
        for (var i = 0; i < this.strategies.length; i++) {
            this.strategies.at(i).bind('change:viewed', self.render);
        }
    },
    render: function() {
        var markup = this.template({
            strategies: this.strategies.toTemplate(),
            layers: this.layers.toTemplate(),
            complete: this.complete
        });
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

var SelectStrategyView = BaseView.extend({
    events: {
        'click button#select-strategy': 'onSelectStrategy',
        'click .strategy-state': 'onShowStrategy'
    },
    initialize: function(options) {
        _.bindAll(
            this, 'render', 'renderMap', 'onSelectStrategy',
            'onShowStrategy', 'maybeComplete');

        this.selectedStrategy = null;
        this.strategies = options.strategies;

        this.initializeResponses(options.responses);
        this.initializeMap(options.layers);
        this.template = require('../static/templates/page_three.html');
        this.strategyTemplate = require('../static/templates/strategy.html');

        var self = this;
        for (var i = 0; i < this.strategies.length; i++) {
            this.strategies.at(i).bind('change:selected', self.render);
        }
    },
    strategyCtx: function() {
        var ctx = {
            strategies: this.strategies.toTemplate(),
            layers: this.layers.toTemplate(),
            selectedStrategy: null
        };

        if (this.selectedStrategy) {
            ctx.selectedStrategy = this.selectedStrategy.toTemplate();
        }
        return ctx;
    },
    render: function() {
        this.selectedStrategy = this.strategies.selected();

        var markup = this.template(this.strategyCtx());
        this.$el.html(markup);
        this.$el.show();

        this.renderMap();

        this.maybeComplete();
    },
    maybeComplete: function() {
        if (this.selectedStrategy) {
            this.trigger('complete', this);
        }
    },
    onSelectStrategy: function(evt) {
        evt.preventDefault();
        var selected = jQuery(this.el).find('input[name="strategy"]:checked');
        if (selected.length < 1) {
            alert('Please select a strategy to defend');
            return false;
        } else {
            var dataId = parseInt(jQuery(selected[0]).val(), 10);
            for (var i = 0; i < this.strategies.length; i++) {
                var strategy = this.strategies.at(i);
                strategy.set('selected', strategy.id === dataId);
            }
        }
    }
});

var DefendStrategyView = BaseView.extend({
    events: {
        'click button#defend-strategy': 'onSubmit',
        'click .strategy-state': 'onShowStrategy'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'renderMap', 'onShowStrategy', 'onSubmit');

        this.complete = false;
        this.strategies = options.strategies;

        this.initializeResponses(options.responses);
        this.initializeMap(options.layers);
        this.template = require('../static/templates/page_four.html');
        this.strategyTemplate = require('../static/templates/strategy.html');
    },
    render: function() {
        var ctx = {
            complete: this.complete,
            strategies: this.strategies.toTemplate(),
            responses: this.responses,
            layers: this.layers.toTemplate(),
            selectedStrategy: this.strategies.selected().toTemplate()
        };

        var markup = this.template(ctx);
        this.$el.html(markup);
        this.$el.show();

        this.renderMap();
    },
    onSubmit: function(evt) {
        evt.preventDefault();

        var form = jQuery(this.el).find('form');
        if (!this.isFormComplete(form)) {
            return;
        }

        this.complete = true;
        this.render();
        this.trigger('complete', this);
    }
});

var ProsAndConsView = BaseView.extend({
    events: {
        'click .strategy-state': 'onShowStrategy'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'renderMap', 'onShowStrategy');

        this.showProsAndCons = true;

        this.complete = true;
        this.strategies = options.strategies;

        this.initializeMap(options.layers);
        this.template = require('../static/templates/page_five.html');
        this.strategyTemplate = require('../static/templates/strategy.html');
    },
    render: function() {
        var ctx = {
            strategies: this.strategies.toTemplate(),
            layers: this.layers.toTemplate(),
            selectedStrategy: this.strategies.selected().toTemplate()
        };

        var markup = this.template(ctx);
        this.$el.html(markup);
        this.$el.show();

        this.renderMap();

        this.complete = true;
        this.trigger('complete', this);
    }
});

var RethinkView = BaseView.extend({
    events: {
        'click button#rethink-strategy': 'onSubmit',
        'click .strategy-state': 'onShowStrategy'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'renderMap', 'onSubmit');

        this.complete = false;
        this.strategies = options.strategies;

        this.initializeResponses(options.responses);
        this.initializeMap(options.layers);
        this.template = require('../static/templates/page_six.html');
        this.strategyTemplate = require('../static/templates/strategy.html');
    },
    render: function() {
        var ctx = {
            complete: this.complete,
            strategies: this.strategies.toTemplate(),
            responses: this.responses,
            layers: this.layers.toTemplate(),
            selectedStrategy: this.strategies.selected().toTemplate()
        };

        var markup = this.template(ctx);
        this.$el.html(markup);
        this.$el.show();

        this.renderMap();
    },
    onSubmit: function(evt) {
        evt.preventDefault();

        var form = jQuery(this.el).find('form');
        if (!this.isFormComplete(form)) {
            return;
        }

        this.complete = true;
        this.render();
        this.trigger('complete', this);
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
        var responses = {};

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

        // Step 3
        page = jQuery('<div></div>');
        $parent.append(page);
        view = new SelectStrategyView({
            el: page,
            layers: layers,
            strategies: strategies,
            responses: responses
        });
        views.push(view);

        // Step 4
        page = jQuery('<div></div>');
        $parent.append(page);
        view = new DefendStrategyView({
            el: page,
            layers: layers,
            strategies: strategies,
            responses: responses
        });
        views.push(view);

        // Step 5
        page = jQuery('<div></div>');
        $parent.append(page);
        view = new ProsAndConsView({
            el: page,
            layers: layers,
            strategies: strategies
        });
        views.push(view);

        // Step 6
        page = jQuery('<div></div>');
        $parent.append(page);
        view = new RethinkView({
            el: page,
            layers: layers,
            strategies: strategies,
            responses: responses
        });
        views.push(view);

        this.steps = new NumberedStepsView({
            el: jQuery('.steps'),
            views: views
        });

        jQuery('.interactive-container').show();
    }
};

module.exports.RuralHealthOfficeApp = RuralHealthOfficeApp;
