// Charts for the "2026 in code" section. Plain SVG, no library.
(function () {
  var dataEl = document.getElementById('stats-data');
  if (!dataEl) return;
  var stats;
  try { stats = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var NS = 'http://www.w3.org/2000/svg';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var SERIES = [
    { key: 'work', label: 'Day job', cls: 'seg-1', sw: 'var(--series-1)' },
    { key: 'collab', label: 'Collaborations', cls: 'seg-2', sw: 'var(--series-2)' },
    { key: 'personal', label: 'Personal', cls: 'seg-3', sw: 'var(--series-3)' }
  ];
  var fmt = new Intl.NumberFormat('en-US');

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, cls, anchor) {
    var t = el('text', { x: x, y: y, class: cls || 'lbl', 'text-anchor': anchor || 'start' }, parent);
    t.textContent = str;
    return t;
  }
  // Rect with only the top (or right) corners rounded, so bars sit flat on the baseline.
  function topRounded(x, y, w, h, r) {
    r = Math.min(r, h, w / 2);
    return 'M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
      'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + h) + 'Z';
  }
  function rightRounded(x, y, w, h, r) {
    r = Math.min(r, w, h / 2);
    return 'M' + x + ',' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) +
      'V' + (y + h - r) + 'Q' + (x + w) + ',' + (y + h) + ' ' + (x + w - r) + ',' + (y + h) + 'H' + x + 'Z';
  }

  function makeTip(host) {
    var tip = document.createElement('div');
    tip.className = 'tip';
    tip.setAttribute('role', 'status');
    host.appendChild(tip);
    return {
      show: function (html, target) {
        tip.innerHTML = html;
        var hb = host.getBoundingClientRect();
        var tb = target.getBoundingClientRect();
        var x = tb.left + tb.width / 2 - hb.left;
        var half = tip.offsetWidth / 2;
        x = Math.max(half, Math.min(hb.width - half, x));
        tip.style.left = x + 'px';
        tip.style.top = (tb.top - hb.top) + 'px';
        tip.classList.add('is-on');
      },
      hide: function () { tip.classList.remove('is-on'); }
    };
  }

  // 1. Contribution calendar
  function heatmap() {
    var host = document.getElementById('heatmap');
    if (!host) return;
    host.innerHTML = '';
    var days = stats.days;
    var keys = Object.keys(days).sort();
    var first = new Date(keys[0] + 'T00:00:00Z');
    var lead = first.getUTCDay();
    var cell = 11, gap = 3, step = cell + gap, left = 30, top = 18;
    var weeks = Math.ceil((keys.length + lead) / 7);
    var w = left + weeks * step, h = top + 7 * step;
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h }, host);
    var tip = makeTip(host);

    ['Mon', 'Wed', 'Fri'].forEach(function (d, i) {
      text(svg, 0, top + (1 + i * 2) * step + cell - 2, d);
    });

    var lastMonth = -1, lastLabelX = -100;
    keys.forEach(function (k, i) {
      var idx = i + lead;
      var col = Math.floor(idx / 7), row = idx % 7;
      var d = new Date(k + 'T00:00:00Z');
      var m = d.getUTCMonth();
      if (m !== lastMonth) {
        var lc = row <= 3 ? col : col + 1;
        if (lc * step - lastLabelX >= 30 || lastMonth === -1) { text(svg, left + lc * step, 11, MONTHS[m]); lastLabelX = lc * step; }
        lastMonth = m;
      }
      var v = days[k];
      var lvl = v === 0 ? 0 : v <= 5 ? 1 : v <= 20 ? 2 : v <= 60 ? 3 : 4;
      var r = el('rect', { x: left + col * step, y: top + row * step, width: cell, height: cell, rx: 2.5, class: 'h' + lvl }, svg);
      r.addEventListener('mouseenter', function () {
        var label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
        tip.show('<b>' + fmt.format(v) + ' contribution' + (v === 1 ? '' : 's') + '</b>' + label, r);
      });
      r.addEventListener('mouseleave', tip.hide);
    });
  }

  // 2. PRs opened per month, stacked by owner
  function months() {
    var host = document.getElementById('months');
    if (!host) return;
    host.innerHTML = '';
    var W = Math.max(280, host.clientWidth), H = 240;
    var m = { l: 34, r: 4, t: 18, b: 24 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var entries = Object.keys(stats.prsByMonth).sort().map(function (k) {
      var v = stats.prsByMonth[k];
      var row = { key: k, label: MONTHS[+k.slice(5) - 1], total: 0 };
      SERIES.forEach(function (s) { row[s.key] = v[s.key] || 0; row.total += row[s.key]; });
      return row;
    });
    var max = Math.ceil(Math.max.apply(null, entries.map(function (e) { return e.total; })) / 100) * 100;
    var y = function (v) { return m.t + ih - (v / max) * ih; };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H }, host);
    var tip = makeTip(host);

    var g = el('g', { class: 'grid' }, svg);
    for (var t = 0; t <= max; t += 100) {
      if (t > 0) el('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t) }, g);
      text(svg, m.l - 8, y(t) + 4, String(t), 'lbl', 'end');
    }
    el('line', { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0), class: 'baseline' }, svg);

    var band = iw / entries.length;
    var bw = Math.min(30, band * 0.62);
    var peak = entries.reduce(function (a, b) { return b.total > a.total ? b : a; });
    var cols = [];
    entries.forEach(function (e, i) {
      var x = m.l + i * band + (band - bw) / 2;
      var col = el('g', {}, svg);
      cols.push(col);
      var base = 0;
      var present = SERIES.filter(function (s) { return e[s.key] > 0; });
      present.forEach(function (s, si) {
        var y0 = y(base), y1 = y(base + e[s.key]);
        var hgt = y0 - y1 - (si > 0 ? 2 : 0); // 2px surface gap between stacked segments
        if (hgt > 0.5) {
          if (si === present.length - 1) el('path', { d: topRounded(x, y1, bw, hgt, 4), class: s.cls }, col);
          else el('rect', { x: x, y: y1, width: bw, height: hgt, class: s.cls }, col);
        }
        base += e[s.key];
      });
      text(svg, x + bw / 2, H - 6, e.label, 'lbl', 'middle');
      if (e === peak) text(svg, x + bw / 2, y(e.total) - 6, fmt.format(e.total), 'val', 'middle');

      var hit = el('rect', { x: m.l + i * band, y: m.t, width: band, height: ih, class: 'hit' }, svg);
      hit.addEventListener('mouseenter', function () {
        cols.forEach(function (c) { c.classList.toggle('is-dim', c !== col); });
        var rows = SERIES.map(function (s) {
          return '<div class="row"><span><i style="background:' + s.sw + '"></i>' + s.label + '</span><span>' + e[s.key] + '</span></div>';
        }).join('');
        tip.show('<b>' + e.label + ' 2026 · ' + fmt.format(e.total) + ' PRs</b>' + rows, col.lastChild || hit);
      });
      hit.addEventListener('mouseleave', function () {
        cols.forEach(function (c) { c.classList.remove('is-dim'); });
        tip.hide();
      });
    });
  }

  // 3. Lines added by language
  function langs() {
    var host = document.getElementById('langs');
    if (!host) return;
    host.innerHTML = '';
    var data = stats.languages;
    var W = Math.max(260, host.clientWidth);
    var rowH = 26, barH = 14, labelW = 78, valW = 44;
    var H = data.length * rowH;
    var iw = W - labelW - valW;
    var max = data[0][1];
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H }, host);
    var tip = makeTip(host);
    el('line', { x1: labelW, x2: labelW, y1: 0, y2: H, class: 'baseline' }, svg);
    data.forEach(function (d, i) {
      var cy = i * rowH + rowH / 2;
      var w = Math.max(2, (d[1] / max) * iw);
      text(svg, labelW - 10, cy + 4, d[0], 'lbl lbl--strong', 'end');
      var bar = el('path', { d: rightRounded(labelW, cy - barH / 2, w, barH, 4), class: 'bar' }, svg);
      text(svg, labelW + w + 6, cy + 4, (d[1] >= 1000 ? Math.round(d[1] / 1000) + 'k' : d[1]), 'val');
      var hit = el('rect', { x: 0, y: i * rowH, width: W, height: rowH, class: 'hit' }, svg);
      hit.addEventListener('mouseenter', function () { tip.show('<b>' + d[0] + '</b>' + fmt.format(d[1]) + ' lines added', bar); });
      hit.addEventListener('mouseleave', tip.hide);
    });
  }

  function renderAll() { heatmap(); months(); langs(); }
  renderAll();
  // On narrow screens the calendar scrolls; start at the most recent weeks.
  var hs = document.querySelector('#heatmap-fig .chart__scroll');
  if (hs) hs.scrollLeft = hs.scrollWidth;
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { months(); langs(); }, 120);
  });
})();
