/* global jQuery: true */
/* eslint security/detect-non-literal-require: 0 */

require('!file-loader?name=[name].[ext]!../static/index.html');
require('./static.js');

// load and apply css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-arrow-buttons/dist/css/bootstrap-arrow-buttons.css';
import '../static/css/common.css';
import '../static/css/steps.css';
import '../static/css/ruralhealth.css';

import jQuery from 'jquery';
import module from './ruralhealth.js';

jQuery(document).ready(function() {
    module.RuralHealthOfficeApp.initialize();
});
