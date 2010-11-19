Synopsis
--------

Tab sets are defined by <DL>s (definition lists) with class 'tabs'.
<DT>s define the tab labels and <DD>s define the tab content.
If a tab label <DT> or tab set <DL> has an id, the active tab will
be saved in the window location URL hash.

Active tab labels and content will be assigned CSS class "active";
the rest will be assigned class "inactive". In addition to controlling
custom site styling, you can also manually pre-assign the desired
classes to control individual <DD> content visibility when Javascript
is disabled.

Call KCSTabs.initialize() on page load. Tabs may be nested.

<head><link rel='stylesheet' href='kcstabs.css' />
<!--[if IE]><link rel='stylesheet' href='kcstabs-ie.css' /><![endif]-->
<script src='prototype.js'></script>
<script src='kcstabs.js'></script>
</head><body onLoad='KCSTabs.initialize()'>
<dl class='tabs' id='tabs1'>
<dt>Tab 1</dt><!-- White space
will be odd in IE! --><dt id='nested'>Tab 2</dt>
<dd>Outer content 1</dd>
<dd>Outer content 2
<dl class='tabs' id='tabs2'>
<dt>Inner 1</dt><dt>Inner 2</dt>
<dd>Inner content 1</dd>
<dd>Inner content 2</dd>
</dl></dd></dl></body>

URL ...#nested,tabs2=0 will activate tabs "Tab 2" and "Inner 1".
