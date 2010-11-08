/*
 * KCSTabs - A tabbed content system based on prototype.js
 * Copyright 2010 Kappa Computer Solutions, LLC and Brian Katzung
 * http://www.kappacs.com/
 *
 * Use and distribution of this code is subject to the "MIT License":
 * http://opensource.org/licenses/mit-license.php
 *
 * 2010-11-05	Version 1.0 created by Brian Katzung
 */

var KCSTabs = (function () {
    // Constructor
    var newClass = function () {
    };

    // Find tab label & content by element, id, or set & tab # (class method).
    // find(tabDT); find('tab_id');
    // find(tabSetDL, tabNum); find('set_id', tabNum);
    newClass.find = function (what, tabNum) {
	if (!what.tagName) {
	    // Not an element; try tab_id or set_id=num.
	    var el = $(what), matches, id_re = /(\w+)=(\d+)/;

	    if (el) {
		what = el;
	    } else if (matches = id_re.exec(what)) {
		what = $(matches[1]);
		tabNum = matches[2];
	    }
	}

	if (what && what.tagName) {
	    var index, tabSet;
	    switch (what.tagName) {
	    case 'DT':
		// Find this tab within the set.
		index = newClass.indexForSet(tabSet = what.parentNode);
		var labels = index.labels, len = labels.length;
		for (tabNum = 0; tabNum < len; ++tabNum) {
		    if (labels[tabNum] == what) {
			break;
		    }
		}
		break;
	    case 'DL':
		// This is the tab set.
		index = newClass.indexForSet(tabSet = what);
		break;
	    }
	    if (index && index.labels[tabNum] && index.content[tabNum]) {
		return { tabSet: tabSet, tabNum: tabNum, index: index,
		  label: index.labels[tabNum], content: index.content[tabNum] };
	    }
	}

	return null;
    };

    // Return tab set label and content index (class method).
    newClass.indexForSet = function (tabSet) {
	var labels = [], content = [];

	tabSet = tabSet.childNodes;
	for (var i = 0, len = tabSet.length; i < len; ++i) {
	    if (tabSet[i].tagName == "DT") {
		labels[labels.length] = tabSet[i];
	    } else if (tabSet[i].tagName == "DD") {
		content[content.length] = tabSet[i];
	    }
	}

	return { labels: labels, content: content };
    }

    // Initialize all DL tab sets (class method).
    newClass.initialize = function () {
	var hash = window.location.hash;

	// Initialize all DL tab sets.
	var tabSets = $$('dl.tabs');
	tabSets.each(function (tabSet) { newClass.initializeSet(tabSet); });

	if (hash) {
	    // Select requested tabs
	    var tabs_re = /[^#,]+/g, match;

	    while (match = tabs_re.exec(hash)) {
		var info = newClass.select(match[0], 0, { noSave: true });
		if (info) {
		    tabSets = tabSets.without(info.tabSet);
		}
	    }
	}

	// Select remaining default tabs and save
	tabSets.each(function (tabSet) {
	    newClass.select(tabSet, 0, { noSave: true }); });
	newClass.save();

	return newClass;
    };

    // Initialize one DL tab set (class method).
    newClass.initializeSet = function (tabSet) {
	for (var i = 0; i < tabSet.childNodes.length; ++i) {
	    var child = tabSet.childNodes[i];

	    if (child.tagName == "DT") {
		(function (node) {
		    Event.observe(node, 'click', function () {
		      newClass.select(node, null, true) }, false);
		})(child);
	    }
	}

	return newClass;
    };

    // Remember selected tags (class method).
    newClass.save = function () {
	var selTabs = $$('dl.tabs > dt.active'), hash = [];

	for (var i = 0; i < selTabs.length; ++i) {
	    var tabId;
	    if (tabId = newClass.tabId(selTabs[i])) {
		hash[hash.length] = tabId;
	    }
	}

	if (hash.length) {
	    window.location.hash = '#' + hash.join(',');
	}

	return newClass;
    };

    // Select a tab in a tab set (class method). Returns "find" results.
    newClass.select = function (what, tabNum, opts) {
	var res = newClass.find(what, tabNum);

	if (!res) {
	    return null;
	}

	if (opts && opts.deselect) {
	    // Undo selection in case of click (thanks to Elegie).
	    // http://bytes.com/topic/javascript/answers
	    // /635488-prevent-text-selection-after-double-click
	    if (document.selection && document.selection.empty) {
		document.selection.empty();
	    } else if (window.getSelection) {
		var sel = window.getSelection();
		if (sel && sel.removeAllRanges) {
		    sel.removeAllRanges();
		}
	    }
	}

	var labels = res.index.labels, content = res.index.content;
	for (var i = 0; i < labels.length; ++i) {
	    if (i == res.tabNum) {
		// Activate this label and content.
		$(labels[i]).removeClassName('inactive');
		labels[i].addClassName('active');
		$(content[i]).removeClassName('inactive');
		content[i].addClassName('active');
		if (content[i].fire) {
		    content[i].fire('tab:selected');
		}
	    } else {
		// Deactivate this label and content.
		if (labels[i]) {
		    $(labels[i]).removeClassName('active');
		    labels[i].addClassName('inactive');
		}
		if (content[i]) {
		    $(content[i]).removeClassName('active');
		    content[i].addClassName('inactive');
		}
	    }
	}

	// Update selected tabs list.
	if (!opts || !opts.noSave) {
	    newClass.save();
	}

	return res;
    };

    // Return the id for a tab (either its own, or set_id=tab_num).
    newClass.tabId = function (tab) {
	if (tab.id) {
	    // Use tab's own id.
	    return tab.id;
	}

	if (tab.parentNode.id) {
	    // Use set_id=tab_num.
	    var tabSet = tab.parentNode.childNodes, selDT = 0;

	    for (var i = 0; i < tabSet.length; ++i) {
		if (tabSet[i].tagName == 'DT') {
		    if (tab == tabSet[i]) {
			return tab.parentNode.id + "=" + selDT;
		    }
		    ++selDT;
		}
	    }
	}

	return null;
    };

    return newClass;
})();
