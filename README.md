Rural Populations: Standalone Interactive Exercise 
==========


#### Background
You are the Springdale County Chair to the North Oralington State Dental Association (NOSDA).

You've been impressed by the different ways dentists have improved oral health care opportunities for rural adults in other parts of the country and you’d like to draw on their experiences to do the same for Springdale County.

You have been notified that NOSDA was awarded a two-year $450,000 grant from a private non-profit institution with the specific goal of improving oral health and access to dental services for rural low income adults. NOSDA leadership has approached you as they are interested in executing the grant within Springdale County.

#### Your charge
1. Review the proposals and the map. 
Review each of the six proposals NOSDA is considering. Each proposal is based on one strategy that has been successful elsewhere at a similar cost and scale. Make sure you choose "Map Layers" to turn on and off data on the map while you read the proposals.

2. Select a proposal.
Select the proposal that will be most successful for improving oral health and access to dental care for poor/low-income rural adults (18-65y/o) in Springdale County.

3. Defend the proposal.
Defend your selected proposal before NOSDA leadership and answer questions about how and why you made your selection.

#### Rural Populations module
This interactive is a small piece of the larger module of [PASS](https://pass.ccnmtl.columbia.edu), a population-based approach to patient services and professional success. PASS was a five-year project to build a website with tools to educate pre-doctoral dental students about patient populations and how demographics play into decision of building a successful dental practice. The PASS content and interactives are being migrated to a sustainable home in the Health Resources and Services Administration [Train](https://www.train.org/) environment.

This and other interactives were developed by the Columbia University [College of Dental Medicine](http://dental.columbia.edu/) in collaboration with the Columbia University [Center ror Teaching & Learning (CTL)](http://ctl.columbia.edu).

REQUIREMENTS
------------
npm
webpack

DEV INSTALLATION
------------
1. Clone the repository
2. Type make runserver. This command will install the necessary npm modules, build the bundle and spin up Webpack's dev server.
3. Navigate to http://localhost:8080.
4. Play around with the interactive!

NPM INSTALLATION
------------
1. npm install dentalruralhealth-pack
2. ./node_modules/webpack/webpack.js --output-path <output_path> --config ./node_modules/dentalruralhealth-pack/webpack.config.js
3. Embed the interactive via an iframe.

```
<code>
    <iframe src="<server>/<output_path>/index.html"></iframe>
</code>
```

#### Configuration
The interactive will alert the user on page navigation if the activity is not yet complete. To turn off this behavior, add a ```quiet=1``` parameter to the url. For example:

```
<code>
    <iframe src="<server>/<output_path>/?quiet=1"></iframe>
</code>
```

