(function() {
  var STATUS_LABELS = {
    'travel-not-been': 'Not been',
    'travel-wish': 'Wish',
    'travel-been': 'Been',
    'travel-lived': 'Lived'
  };

  function readTravelData() {
    var node = document.getElementById('travel-data');

    if (!node) {
      return null;
    }

    try {
      return JSON.parse(node.textContent);
    } catch (error) {
      console.error('Travel data could not be parsed.', error);
      return null;
    }
  }

  function findById(root, id) {
    return root.querySelector('[id="' + id + '"]');
  }

  function injectSvgStyles(svgRoot, palette) {
    var style = svgRoot.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'style');

    style.textContent = [
      '.country path, .country circle { transition: fill 0.2s ease, opacity 0.2s ease; stroke: #ffffff; stroke-width: 0.15; }',
      'path.travel-not-been, circle.travel-not-been { fill: ' + palette.not_been + ' !important; }',
      'path.travel-wish, circle.travel-wish { fill: ' + palette.wish + ' !important; }',
      'path.travel-been, circle.travel-been { fill: ' + palette.been + ' !important; }',
      'path.travel-lived, circle.travel-lived { fill: ' + palette.lived + ' !important; }',
      '.travel-hover { opacity: 0.88; cursor: pointer; }',
      'circle.travel-visible { display: block !important; stroke: #ffffff; stroke-width: 0.2; }'
    ].join('\n');

    svgRoot.appendChild(style);
  }

  function updateHoverPanel(label, type, statusClass, palette) {
    var nameNode = document.getElementById('travel-hover-name');
    var typeNode = document.getElementById('travel-hover-type');
    var statusNode = document.getElementById('travel-hover-status');
    var dotNode = document.querySelector('.travel-hover-dot');

    if (!nameNode || !typeNode || !statusNode || !dotNode) {
      return;
    }

    nameNode.textContent = label;
    typeNode.textContent = type;
    statusNode.textContent = STATUS_LABELS[statusClass] || STATUS_LABELS['travel-not-been'];
    dotNode.style.backgroundColor = palette[statusClass.replace('travel-', '').replace('-', '_')] || palette.not_been;
  }

  function resetHoverPanel() {
    updateHoverPanel('Bewege die Maus ueber ein Land oder einen US-Staat', 'Ort', 'travel-not-been', {
      not_been: '#cbd1e5',
      wish: '#4d6594',
      been: '#e013da',
      lived: '#0f081e'
    });
  }

  function ensureTitle(element, label) {
    var title = element.querySelector('title');

    if (!title) {
      title = element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
      element.appendChild(title);
    }

    title.textContent = label;
  }

  function addHoverEvents(target, label, type, statusClass, palette, hoverClass) {
    target.addEventListener('mouseenter', function() {
      if (hoverClass) {
        target.classList.add(hoverClass);
      } else {
        target.classList.add('travel-hover');
      }
      updateHoverPanel(label, type, statusClass, palette);
    });

    target.addEventListener('mouseleave', function() {
      if (hoverClass) {
        target.classList.remove(hoverClass);
      } else {
        target.classList.remove('travel-hover');
      }
      resetHoverPanel();
    });
  }

  function buildCountryMaps(travelData) {
    var statusMap = {};
    var labelMap = {};

    ['lived', 'been', 'wish'].forEach(function(status) {
      (travelData.countries[status] || []).forEach(function(entry) {
        statusMap[entry.code] = 'travel-' + status;
        labelMap[entry.code] = entry.name;
      });
    });

    return {
      statusMap: statusMap,
      labelMap: labelMap
    };
  }

  function applyWorldStatuses(svgRoot, travelData) {
    var palette = travelData.palette;
    var maps = buildCountryMaps(travelData);
    var statusMap = maps.statusMap;
    var labelMap = maps.labelMap;

    injectSvgStyles(svgRoot, palette);

    Array.prototype.forEach.call(svgRoot.querySelectorAll('.country > g'), function(group) {
      var path = group.querySelector('path[id]');
      var title = group.querySelector('title');

      if (!path) {
        return;
      }

      var code = path.id;
      var label = labelMap[code] || (title ? title.textContent : code);
      var statusClass = statusMap[code] || 'travel-not-been';

      path.classList.add(statusClass);
      ensureTitle(group, label);
      addHoverEvents(path, label, 'Land', statusClass, palette);

      var circle = findById(svgRoot, code + '-circle');
      if (circle && statusMap[code]) {
        circle.classList.add(statusClass, 'travel-visible');
        ensureTitle(circle, label);
        addHoverEvents(circle, label, 'Land', statusClass, palette);
      }
    });

    Object.keys(statusMap).forEach(function(code) {
      var path = findById(svgRoot, code);
      var circle = findById(svgRoot, code + '-circle');
      var label = labelMap[code] || code;

      if (path) {
        path.classList.remove('travel-not-been');
        path.classList.add(statusMap[code]);
        ensureTitle(path.parentNode || path, label);
      }

      if (circle) {
        circle.classList.add(statusMap[code], 'travel-visible');
        ensureTitle(circle, label);
      }
    });
  }

  function loadSvgIntoContainer(containerId, callback) {
    var container = document.getElementById(containerId);

    if (!container) {
      return;
    }

    fetch(container.getAttribute('data-map-url'))
      .then(function(response) { return response.text(); })
      .then(function(svgText) {
        var parser = new DOMParser();
        var svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
        var svgRoot = svgDocument.documentElement;
        var width = svgRoot.getAttribute('width');
        var height = svgRoot.getAttribute('height');

        if (!svgRoot.getAttribute('viewBox') && width && height) {
          svgRoot.setAttribute('viewBox', '0 0 ' + parseFloat(width) + ' ' + parseFloat(height));
        }

        svgRoot.removeAttribute('width');
        svgRoot.removeAttribute('height');
        svgRoot.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        container.innerHTML = '';
        container.appendChild(svgRoot);
        callback(svgRoot);
      })
      .catch(function(error) {
        console.error('SVG could not be loaded.', error);
      });
  }

  function updateStats(travelData) {
    var countryTouched = (travelData.countries.lived || []).length + (travelData.countries.been || []).length;
    var stateTouched = (travelData.us_states.lived || []).length + (travelData.us_states.been || []).length;
    var wishCount = (travelData.countries.wish || []).length + (travelData.us_states.wish || []).length;
    var livedCount = (travelData.countries.lived || []).length + (travelData.us_states.lived || []).length;

    var values = {
      'travel-stat-countries': countryTouched,
      'travel-stat-wish': wishCount,
      'travel-stat-us': stateTouched,
      'travel-stat-lived': livedCount
    };

    Object.keys(values).forEach(function(id) {
      var node = document.getElementById(id);
      if (node) {
        node.textContent = values[id];
      }
    });
  }

  function buildUsMaps(travelData) {
    var statusMap = {};
    var labelMap = {};

    ['lived', 'been', 'wish'].forEach(function(status) {
      (travelData.us_states[status] || []).forEach(function(entry) {
        statusMap[entry.code] = 'travel-' + status;
        labelMap[entry.code] = entry.name;
      });
    });

    return {
      statusMap: statusMap,
      labelMap: labelMap
    };
  }

  function injectUsSvgStyles(svgRoot, palette) {
    var style = svgRoot.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'style');

    style.textContent = [
      'g.state > path { transition: fill 0.2s ease, opacity 0.2s ease; }',
      'circle.dccircle { display: none !important; }',
      'path.travel-hover, circle.travel-hover { opacity: 0.88; cursor: pointer; }'
    ].join('\n');

    svgRoot.appendChild(style);
  }

  function statusColor(statusClass, palette) {
    if (statusClass === 'travel-lived') {
      return palette.lived;
    }

    if (statusClass === 'travel-been') {
      return palette.been;
    }

    if (statusClass === 'travel-wish') {
      return palette.wish;
    }

    return palette.not_been;
  }

  function applyUsStatuses(svgRoot, travelData) {
    var palette = travelData.palette;
    var maps = buildUsMaps(travelData);
    var statusMap = maps.statusMap;
    var labelMap = maps.labelMap;

    injectUsSvgStyles(svgRoot, palette);

    Array.prototype.forEach.call(svgRoot.querySelectorAll('g.state > path'), function(path) {
      var className = path.getAttribute('class') || '';
      var match = className.match(/\b([a-z]{2})\b/);
      var title = path.querySelector('title');
      var code;
      var label;
      var statusClass;

      if (!match) {
        return;
      }

      code = match[1].toUpperCase();
      label = labelMap[code] || (title ? title.textContent : code);
      statusClass = statusMap[code] || 'travel-not-been';

      path.classList.add(statusClass);
      path.style.fill = statusColor(statusClass, palette);
      ensureTitle(path, label);
      addHoverEvents(path, label, 'US-Staat', statusClass, palette);
    });

    Array.prototype.forEach.call(svgRoot.querySelectorAll('circle.dccircle.dc'), function(circle) {
      circle.style.display = 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var travelData = readTravelData();

    if (!travelData) {
      return;
    }

    resetHoverPanel();
    updateStats(travelData);
    loadSvgIntoContainer('world-map-container', function(svgRoot) {
      applyWorldStatuses(svgRoot, travelData);
    });
    loadSvgIntoContainer('us-map-container', function(svgRoot) {
      applyUsStatuses(svgRoot, travelData);
    });
  });
})();
