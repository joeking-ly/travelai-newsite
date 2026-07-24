/* Network page — "What makes it work" tab animations.
   Beat 1 is a vanilla port of the SpeedScaleMotion loop
   (content-export/Speed and Scale.html); the other tabs follow the same
   visual language: warm paper stage, ink pills, spectrum accents.
   On phones (<=640px) each animation renders on a portrait 720x1000 stage
   with vertically stacked layouts so the graphics stay legible. */
(function () {
  'use strict';

  var SPECTRUM =
    'linear-gradient(90deg,#FF6B6B 0%,#FFA500 14%,#FFD700 28%,#32CD32 42%,#00CED1 57%,#4169E1 71%,#9370DB 85%,#FF1493 100%)';
  var STOPS = ['#FF6B6B', '#FFA500', '#FFD700', '#32CD32', '#00CED1', '#4169E1', '#9370DB', '#FF1493'];
  var INK = '#0A0A0F';
  var GRAY = '#8a8578';
  var LINE = '#e2ddd0';
  var MOBILE = window.matchMedia('(max-width: 640px)').matches;
  var W = MOBILE ? 720 : 1600;
  var H = MOBILE ? 1000 : 560;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function seg(p, a, b, linear) {
    var t = clamp((p - a) / (b - a), 0, 1);
    return linear ? t : easeInOutCubic(t);
  }
  function bump(x, w) {
    w = w || 0.16;
    return Math.exp(-(x * x) / (2 * w * w));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function el(parent, css, text) {
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;' + css;
    if (text != null) d.textContent = text;
    parent.appendChild(d);
    return d;
  }

  /* Rainbow is reserved for graphic elements; headline accents stay ink. */
  function headline(parent, plain, accent) {
    var h = el(
      parent,
      'left:0;right:0;top:36px;text-align:center;font-size:' +
        (MOBILE ? 46 : 54) +
        'px;font-weight:700;letter-spacing:-0.02em;color:' +
        INK +
        ';'
    );
    h.innerHTML = plain + ' <em style="font-style:italic;">' + accent + '</em>';
    return h;
  }

  function headlineTick(h, on) {
    h.style.opacity = on;
    h.style.transform = 'translateY(' + 12 * (1 - on) + 'px)';
  }

  /* Mounts a scaled stage in a host and drives its scenes.
     scenes: [{ dur, el, render(p) }] — built by the setup callback. */
  function mountMotion(hostId, setup, staticProgress) {
    var host = document.getElementById(hostId);
    if (!host) return;
    host.setAttribute('aria-hidden', 'true');

    var stage = el(host, 'left:50%;top:50%;width:' + W + 'px;height:' + H + 'px;');
    stage.style.fontFamily = "'Inter Tight',sans-serif";

    function fit() {
      var r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var s = Math.min(r.width / W, r.height / H);
      stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
    }
    fit();
    if (window.ResizeObserver) {
      new ResizeObserver(fit).observe(host);
    } else {
      window.addEventListener('resize', fit);
    }

    var scenes = setup(stage);
    scenes.forEach(function (sc, i) {
      sc.el.style.display = i === 0 ? 'block' : 'none';
    });
    var TOTAL = scenes.reduce(function (a, s) {
      return a + s.dur;
    }, 0);

    if (REDUCED) {
      scenes.forEach(function (sc, i) {
        sc.el.style.display = i === 0 ? 'block' : 'none';
      });
      scenes[0].render(staticProgress == null ? 0.95 : staticProgress);
      return;
    }

    var inView = false;
    new IntersectionObserver(
      function (entries) {
        inView = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    ).observe(host);

    var panel = host.closest('.nwc-works-panel');
    var start = null;
    var wasActive = false;
    function frame(now) {
      requestAnimationFrame(frame);
      if (!inView || document.hidden) return;
      var active = !panel || panel.classList.contains('is-active');
      if (active && !wasActive) start = now; // restart loop on tab switch
      wasActive = active;
      if (!active) return;
      if (start == null) start = now;
      var t = ((now - start) / 1000) % TOTAL;
      var acc = 0;
      scenes.forEach(function (sc) {
        var on = t >= acc && t < acc + sc.dur;
        sc.el.style.display = on ? 'block' : 'none';
        if (on) sc.render((t - acc) / sc.dur);
        acc += sc.dur;
      });
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     01 · Speed & Scale — Travelers → Milliseconds → Combinations
     ============================================================ */
  mountMotion('nwc-motion-speed-scale', function (stage) {
    /* Beat 1: millions of travelers */
    var QUERIES = ['Kyoto · April', 'Lisbon · family', 'Tokyo · solo', 'Alps · ski', 'Bali · surf', 'Rome · food'];
    var s1 = el(stage, 'inset:0;');
    var s1Head = headline(s1, 'Millions of', 'travelers');
    var chips = QUERIES.map(function (q, i) {
      var left, top, width;
      if (MOBILE) {
        /* single centered column */
        left = 100;
        top = 150 + i * 122;
        width = 520;
      } else {
        var col = i % 3;
        var row = (i / 3) | 0;
        left = 130 + col * 460;
        top = 170 + row * 140;
        width = 420;
      }
      var c = el(
        s1,
        'left:' +
          left +
          'px;top:' +
          top +
          'px;width:' +
          width +
          'px;display:flex;align-items:center;gap:16px;background:#fff;border:2px solid ' +
          LINE +
          ';border-radius:100px;padding:16px 26px;box-sizing:border-box;box-shadow:0 8px 22px rgba(10,10,15,0.05);'
      );
      c.innerHTML =
        '<div style="width:48px;height:48px;border-radius:50%;background:' +
        INK +
        ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;flex-shrink:0;">' +
        q.charAt(0) +
        '</div><div style="font-size:28px;font-weight:600;color:' +
        INK +
        ';white-space:nowrap;">' +
        q +
        '</div><div data-dot style="margin-left:auto;width:14px;height:14px;border-radius:50%;background:' +
        STOPS[i % 8] +
        ';"></div>';
      return { root: c, dot: c.querySelector('[data-dot]') };
    });

    function renderTravelers(p) {
      headlineTick(s1Head, seg(p, 0.06, 0.14));
      chips.forEach(function (c, i) {
        var vis = seg(p, 0.05 + i * 0.06, 0.18 + i * 0.06);
        var drift = Math.sin(p * Math.PI * 2 + i * 1.7) * 4 * Math.sin(Math.PI * p);
        c.root.style.opacity = vis;
        c.root.style.transform = 'translateY(' + (20 * (1 - vis) + drift) + 'px)';
        c.dot.style.opacity = 0.9 * bump(((p * 3) % 1) - i / 6, 0.09);
      });
    }

    /* Beat 2: millisecond responses */
    var s2 = el(stage, 'inset:0;');
    var s2Head = headline(s2, 'Answers in', 'milliseconds');
    var pill = el(
      s2,
      (MOBILE ? 'left:100px;top:140px;width:520px;' : 'left:110px;top:280px;width:430px;') +
        'background:' +
        INK +
        ';border-radius:100px;padding:18px 28px;display:flex;align-items:center;gap:16px;box-sizing:border-box;'
    );
    pill.innerHTML =
      '<div style="width:48px;height:48px;border-radius:50%;background:#fff;color:' +
      INK +
      ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;flex-shrink:0;">K</div>' +
      '<div style="font-size:28px;font-weight:600;color:#fff;white-space:nowrap;">Kyoto · April</div>';

    /* Six property cards: photo block, name, nightly price */
    var PROPS = [
      { name: 'Seaside Villa', price: '$240 / night', tone: '#d9cbb8' },
      { name: 'City Loft', price: '$180 / night', tone: '#c9cdd6' },
      { name: 'Garden House', price: '$210 / night', tone: '#c7d2c4' },
      { name: 'Lake Cabin', price: '$160 / night', tone: '#cbd4dc' },
      { name: 'Old Town Suite', price: '$200 / night', tone: '#d5c9d2' },
      { name: 'Coast Retreat', price: '$260 / night', tone: '#dcd0c2' },
    ];
    var cells = PROPS.map(function (prop, ci) {
      var left, top, delay;
      if (MOBILE) {
        /* 2 x 3 grid below the query pill */
        var colM = ci % 2;
        var rowM = (ci / 2) | 0;
        left = 90 + colM * 290;
        top = 280 + rowM * 205;
        delay = rowM * 0.12 + colM * 0.06;
      } else {
        var col2 = ci % 3;
        var row2 = (ci / 3) | 0;
        left = 700 + col2 * 280;
        top = 150 + row2 * 210;
        delay = col2 * 0.17 + row2 * 0.08;
      }
      var cell = el(
        s2,
        'left:' +
          left +
          'px;top:' +
          top +
          'px;width:250px;height:190px;border-radius:18px;background:#fff;border:2px solid ' +
          LINE +
          ';box-sizing:border-box;overflow:hidden;'
      );
      cell.innerHTML =
        '<div style="position:absolute;left:10px;top:10px;right:10px;height:88px;border-radius:10px;background:linear-gradient(135deg,' +
        prop.tone +
        ' 0%,#efe9de 100%);"></div>' +
        '<div style="position:absolute;left:16px;top:110px;font-size:21px;font-weight:600;color:' +
        INK +
        ';white-space:nowrap;">' +
        prop.name +
        '</div>' +
        '<div style="position:absolute;left:16px;top:140px;font-size:18px;font-weight:500;color:' +
        GRAY +
        ';">' +
        prop.price +
        '</div>';
      var bar = el(cell, 'left:0;bottom:0;right:0;height:5px;opacity:0;background:' + SPECTRUM + ';');
      return { root: cell, bar: bar, delay: delay };
    });
    var travelDots = [0, 1].map(function () {
      return el(
        s2,
        (MOBILE ? 'left:351px;' : 'top:313px;') +
          'width:18px;height:18px;border-radius:50%;background:' +
          INK +
          ';box-shadow:0 0 18px 5px rgba(10,10,15,0.25);opacity:0;'
      );
    });

    function renderResponses(p) {
      headlineTick(s2Head, seg(p, 0.06, 0.14));
      var u1 = seg(p, 0.08, 0.48, true);
      var u2 = seg(p, 0.52, 0.92, true);
      cells.forEach(function (c) {
        var glow = Math.max(bump(u1 * 1.35 - 0.1 - c.delay, 0.13), bump(u2 * 1.35 - 0.1 - c.delay, 0.13));
        var lit = glow > 0.45;
        c.root.style.borderColor = lit ? INK : LINE;
        c.root.style.transform = 'translateY(' + -8 * glow + 'px)';
        c.root.style.boxShadow =
          '0 ' + (6 + 14 * glow) + 'px ' + (18 + 20 * glow) + 'px rgba(10,10,15,' + (0.04 + 0.1 * glow) + ')';
        c.bar.style.opacity = lit ? glow : 0;
      });
      [u1, u2].forEach(function (u, j) {
        var d = travelDots[j];
        if (u > 0.01 && u < 0.24) {
          d.style.opacity = Math.sin((u / 0.24) * Math.PI);
          if (MOBILE) {
            /* portrait: the request drops from the pill down to the grid */
            d.style.top = lerp(230, 275, u / 0.24) + 'px';
          } else {
            d.style.left = lerp(560, 700, u / 0.24) + 'px';
          }
        } else {
          d.style.opacity = 0;
        }
      });
    }

    /* Beat 3: preference combinations */
    var SLOTS = [
      { opts: ['quiet', 'lively', 'central', 'seaside'], lockAt: 0.34, final: 'quiet', check: STOPS[0] },
      { opts: ['villa', 'boutique', 'apartment', 'resort'], lockAt: 0.48, final: 'villa', check: STOPS[3] },
      { opts: ['< $250', '< $400', 'flexible', 'points'], lockAt: 0.62, final: '< $250', check: STOPS[6] },
    ];
    var s3 = el(stage, 'inset:0;');
    var s3Head = headline(s3, 'Every', 'preference');
    var slotEls = SLOTS.map(function (s, k) {
      var pos = MOBILE
        ? 'left:120px;top:' + (170 + k * 160) + 'px;width:480px;'
        : 'left:' + (170 + k * 440) + 'px;top:200px;width:380px;';
      var root = el(
        s3,
        pos +
          'height:104px;border-radius:100px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:600;box-sizing:border-box;'
      );
      var label = document.createElement('span');
      root.appendChild(label);
      var check = document.createElement('span');
      check.textContent = '✓';
      check.style.cssText = 'margin-left:14px;font-size:30px;color:' + s.check + ';display:none;';
      root.appendChild(check);
      return { root: root, label: label, check: check, lastText: null, lastLocked: null };
    });
    /* × separators: centered in the gap between pills */
    [0, 1].forEach(function (k) {
      var pos = MOBILE
        ? 'left:0;right:0;top:' + (274 + k * 160) + 'px;height:56px;'
        : 'left:' + (550 + k * 440) + 'px;top:200px;width:60px;height:104px;';
      el(
        s3,
        pos +
          'display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:500;color:' +
          GRAY +
          ';',
        '×'
      );
    });
    var matchLine = el(
      s3,
      'left:0;right:0;top:' +
        (MOBILE ? 700 : 370) +
        'px;text-align:center;font-size:40px;font-weight:700;color:' +
        INK +
        ';'
    );
    matchLine.innerHTML = 'Quiet villa · 97% match';

    function renderCombinations(p) {
      headlineTick(s3Head, seg(p, 0.04, 0.12));
      SLOTS.forEach(function (s, k) {
        var slot = slotEls[k];
        var locked = p >= s.lockAt;
        var text = locked ? s.final : s.opts[Math.floor(p * (26 - k * 5)) % s.opts.length];
        if (text !== slot.lastText) {
          slot.label.textContent = text;
          slot.lastText = text;
        }
        if (locked !== slot.lastLocked) {
          slot.root.style.background = locked ? INK : '#fff';
          slot.root.style.border = '2px solid ' + (locked ? INK : LINE);
          slot.root.style.color = locked ? '#fff' : GRAY;
          slot.root.style.boxShadow = locked
            ? '0 14px 34px rgba(10,10,15,0.15)'
            : '0 8px 22px rgba(10,10,15,0.05)';
          slot.check.style.display = locked ? 'inline' : 'none';
          slot.lastLocked = locked;
        }
        slot.root.style.transform = 'scale(' + (1 + 0.08 * bump(p - s.lockAt, 0.02)) + ')';
      });
      var matchOn = seg(p, 0.72, 0.84);
      matchLine.style.opacity = matchOn;
      matchLine.style.transform = 'translateY(' + 16 * (1 - matchOn) + 'px)';
    }

    return [
      { el: s1, dur: 4.5, render: renderTravelers },
      { el: s2, dur: 5.5, render: renderResponses },
      { el: s3, dur: 5.0, render: renderCombinations },
    ];
  });

  /* ============================================================
     02 · Network Learning — one interaction ripples to every node
     ============================================================ */
  mountMotion(
    'nwc-motion-learning',
    function (stage) {
      var s = el(stage, 'inset:0;');
      var head = headline(s, 'Every interaction', 'compounds');
      /* Same 2x5 lattice; portrait transposes it into two columns */
      var NODES = MOBILE
        ? [
            [190, 200], [170, 340], [210, 480], [180, 620], [200, 760],
            [530, 240], [550, 380], [510, 520], [540, 660], [520, 790],
          ]
        : [
            [220, 220], [500, 180], [800, 160], [1100, 190], [1380, 240],
            [320, 420], [600, 380], [880, 360], [1160, 400], [1400, 460],
          ];
      var EDGES = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [5, 6], [6, 7], [7, 8], [8, 9],
        [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
        [1, 5], [2, 6], [3, 7], [4, 8],
      ];
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      s.appendChild(svg);
      var edgeEls = EDGES.map(function (e) {
        var ln = document.createElementNS(svgNS, 'line');
        ln.setAttribute('x1', NODES[e[0]][0]);
        ln.setAttribute('y1', NODES[e[0]][1]);
        ln.setAttribute('x2', NODES[e[1]][0]);
        ln.setAttribute('y2', NODES[e[1]][1]);
        ln.setAttribute('stroke', LINE);
        ln.setAttribute('stroke-width', '3');
        svg.appendChild(ln);
        return ln;
      });
      var nodeEls = NODES.map(function (n, i) {
        var d = el(
          s,
          'left:' +
            (n[0] - 26) +
            'px;top:' +
            (n[1] - 26) +
            'px;width:52px;height:52px;border-radius:50%;background:#fff;border:3px solid ' +
            LINE +
            ';box-sizing:border-box;display:flex;align-items:center;justify-content:center;'
        );
        var core = el(d, 'position:static;width:16px;height:16px;border-radius:50%;background:' + STOPS[i % 8] + ';opacity:0.25;');
        return { root: d, core: core };
      });
      var ripple = el(
        s,
        'width:60px;height:60px;border-radius:50%;border:3px solid ' + INK + ';opacity:0;pointer-events:none;'
      );
      var tag = el(
        s,
        'left:0;right:0;top:' +
          (MOBILE ? 880 : 490) +
          'px;text-align:center;font-size:30px;font-weight:600;color:' +
          GRAY +
          ';'
      );
      tag.innerHTML = 'one booking · <span style="color:' + INK + ';">the whole network learns</span>';

      var ORIGINS = [6, 2, 9];
      var MAXD = MOBILE ? 800 : 1400;
      var RIPPLE_MAX = MOBILE ? 400 : 520;

      function dist(a, b) {
        var dx = NODES[a][0] - NODES[b][0];
        var dy = NODES[a][1] - NODES[b][1];
        return Math.sqrt(dx * dx + dy * dy);
      }

      function render(p) {
        headlineTick(head, seg(p, 0.04, 0.12));
        tag.style.opacity = seg(p, 0.1, 0.2);
        var beat = Math.min(2, Math.floor(p * 3));
        var sub = p * 3 - beat;
        var origin = ORIGINS[beat];
        var r = seg(sub, 0.12, 0.75, true) * MAXD;
        var fade = 1 - seg(sub, 0.82, 0.98);
        var pop = 1 + 0.25 * bump(sub - 0.1, 0.05);

        nodeEls.forEach(function (n, i) {
          var lit = clamp((r - dist(origin, i)) / 140, 0, 1) * fade;
          if (i === origin) lit = Math.max(lit, seg(sub, 0.02, 0.1) * fade);
          n.root.style.borderColor = lit > 0.5 ? INK : LINE;
          n.root.style.background = lit > 0.5 ? INK : '#fff';
          n.root.style.transform = 'scale(' + (i === origin ? pop : 1 + 0.12 * lit) + ')';
          n.core.style.opacity = 0.25 + 0.75 * lit;
        });
        edgeEls.forEach(function (ln, k) {
          var e = EDGES[k];
          var lit =
            Math.min(clamp((r - dist(origin, e[0])) / 140, 0, 1), clamp((r - dist(origin, e[1])) / 140, 0, 1)) * fade;
          ln.setAttribute('stroke', lit > 0.5 ? INK : LINE);
          ln.setAttribute('stroke-width', 3 + 2 * lit);
        });
        var rippleR = 60 + seg(sub, 0.08, 0.7, true) * RIPPLE_MAX;
        ripple.style.left = NODES[origin][0] - rippleR / 2 + 'px';
        ripple.style.top = NODES[origin][1] - rippleR / 2 + 'px';
        ripple.style.width = rippleR + 'px';
        ripple.style.height = rippleR + 'px';
        ripple.style.opacity = 0.5 * Math.sin(Math.PI * seg(sub, 0.08, 0.7, true)) * fade;
      }

      return [{ el: s, dur: 9, render: render }];
    },
    0.3
  );

  /* ============================================================
     03 · Clear Attribution — a booking, traced back through every handoff
     ============================================================ */
  mountMotion(
    'nwc-motion-attribution',
    function (stage) {
      var s = el(stage, 'inset:0;');
      var head = headline(s, 'Every handoff,', 'attributed');
      var STEPS = ['Traveler', 'Agent', 'TravelAI', 'Partner'];
      /* Landscape: boxes flow left→right. Portrait: boxes flow top→bottom
         with the "attributed" tick beside each box. */
      var BOXW = MOBILE ? 320 : 280;
      var BOXH = MOBILE ? 104 : 110;
      var boxes = STEPS.map(function (label, k) {
        var x = MOBILE ? (720 - BOXW) / 2 : 150 + k * 350;
        var y = MOBILE ? 170 + k * 160 : 200;
        var b = el(
          s,
          'left:' +
            x +
            'px;top:' +
            y +
            'px;width:' +
            BOXW +
            'px;height:' +
            BOXH +
            'px;border-radius:24px;background:#fff;border:2px solid ' +
            LINE +
            ';box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:600;color:' +
            INK +
            ';box-shadow:0 8px 22px rgba(10,10,15,0.05);z-index:1;',
          label
        );
        var tick;
        if (MOBILE) {
          /* portrait: the colored check lands inside the box itself */
          tick = document.createElement('span');
          tick.style.cssText =
            'display:inline-block;margin-left:12px;font-size:30px;color:' + STOPS[(k * 2) % 8] + ';opacity:0;';
          tick.textContent = '✓';
          b.appendChild(tick);
        } else {
          tick = el(
            s,
            'left:' + x + 'px;top:330px;width:' + BOXW + 'px;text-align:center;font-size:26px;font-weight:600;color:' + GRAY + ';opacity:0;'
          );
          tick.innerHTML = '<span style="color:' + STOPS[(k * 2) % 8] + ';">✓</span> attributed';
        }
        return { box: b, tick: tick, x: x, y: y };
      });
      /* flow axis: horizontal center positions (landscape) or vertical (portrait) */
      var flow0 = MOBILE ? boxes[0].y + BOXH / 2 : boxes[0].x + BOXW / 2;
      var flow1 = MOBILE ? boxes[3].y + BOXH / 2 : boxes[3].x + BOXW / 2;
      var railCross = MOBILE ? boxes[0].x + BOXW / 2 : 253; /* px across the flow axis */
      var dot = el(
        s,
        (MOBILE ? 'left:' + (railCross - 9) + 'px;' : 'top:246px;') +
          'width:18px;height:18px;border-radius:50%;background:' +
          INK +
          ';box-shadow:0 0 18px 5px rgba(10,10,15,0.25);opacity:0;'
      );
      /* base connector line, always visible behind the boxes */
      el(
        s,
        MOBILE
          ? 'left:' + (railCross - 2) + 'px;top:' + flow0 + 'px;width:4px;height:' + (flow1 - flow0) + 'px;border-radius:2px;background:' + LINE + ';'
          : 'left:' + flow0 + 'px;top:253px;width:' + (flow1 - flow0) + 'px;height:4px;border-radius:2px;background:' + LINE + ';'
      );
      /* spectrum trace grows along the flow behind the dot */
      var trace = el(
        s,
        MOBILE
          ? 'left:' + (railCross - 3) + 'px;top:' + flow0 + 'px;width:6px;border-radius:3px;background:linear-gradient(180deg,#FF6B6B 0%,#FFA500 14%,#FFD700 28%,#32CD32 42%,#00CED1 57%,#4169E1 71%,#9370DB 85%,#FF1493 100%);height:0;opacity:0;'
          : 'left:' + flow0 + 'px;top:252px;height:6px;border-radius:3px;background:' + SPECTRUM + ';width:0;opacity:0;'
      );
      var booked = el(
        s,
        'left:0;right:0;top:' +
          (MOBILE ? 850 : 420) +
          'px;text-align:center;font-size:38px;font-weight:700;color:' +
          INK +
          ';'
      );
      booked.innerHTML = 'Booked · <span style="color:' + GRAY + ';font-weight:600;">every step visible</span>';

      function render(p) {
        headlineTick(head, seg(p, 0.04, 0.12));
        var fade = 1 - seg(p, 0.92, 0.99);
        /* single pass along the flow: the dot carries the trace with it and
           each box lights + reveals its "attributed" label as the dot arrives */
        var f = seg(p, 0.14, 0.62);
        var pos = lerp(flow0, flow1, f);
        if (MOBILE) {
          dot.style.top = pos - 9 + 'px';
          trace.style.height = pos - flow0 + 'px';
        } else {
          dot.style.left = pos - 9 + 'px';
          trace.style.width = pos - flow0 + 'px';
        }
        dot.style.opacity = (p > 0.12 && p < 0.64 ? 1 : 0) * fade;
        trace.style.opacity = (p > 0.14 ? 1 : 0) * fade;
        boxes.forEach(function (b) {
          var c = MOBILE ? b.y + BOXH / 2 : b.x + BOXW / 2;
          var arrived = seg(p, 0.14, 0.62) >= (c - flow0) / (flow1 - flow0) - 0.001;
          var lit = arrived && fade > 0;
          b.box.style.borderColor = lit ? INK : LINE;
          b.box.style.boxShadow = lit ? '0 14px 30px rgba(10,10,15,0.12)' : '0 8px 22px rgba(10,10,15,0.05)';
          b.box.style.transform = 'translateY(' + (lit ? -6 : 0) + 'px)';
          /* label eases in over the 80px approach to each box */
          var on = (p > 0.12 ? clamp((pos - c + 80) / 80, 0, 1) : 0) * fade;
          b.tick.style.opacity = on;
          b.tick.style.transform = 'translateY(' + 10 * (1 - on) + 'px)';
        });
        /* booked flag lands after the pass completes */
        var bOn = seg(p, 0.66, 0.74) * fade;
        booked.style.opacity = bOn;
        booked.style.transform = 'translateY(' + 14 * (1 - bOn) + 'px)';
      }

      return [{ el: s, dur: 9, render: render }];
    },
    0.85
  );

  /* ============================================================
     04 · Outcome Optimization — both sides of the trade rise together
     ============================================================ */
  mountMotion(
    'nwc-motion-outcomes',
    function (stage) {
      var s = el(stage, 'inset:0;');
      var head = headline(s, 'Optimized for', 'outcomes');
      var TRACKS = MOBILE
        ? [
            { label: 'Traveler satisfaction', top: 250, target: 0.96, fmt: function (v) { return Math.round(v * 100) + '%'; } },
            { label: 'Partner ROI', top: 450, target: 0.88, fmt: function (v) { return (v * 3.9).toFixed(1) + '×'; } },
          ]
        : [
            { label: 'Traveler satisfaction', top: 200, target: 0.96, fmt: function (v) { return Math.round(v * 100) + '%'; } },
            { label: 'Partner ROI', top: 330, target: 0.88, fmt: function (v) { return (v * 3.9).toFixed(1) + '×'; } },
          ];
      var TRACKX = MOBILE ? 80 : 150;
      var TRACKW = MOBILE ? 560 : 1160;
      var tracks = TRACKS.map(function (t) {
        el(
          s,
          'left:' + TRACKX + 'px;top:' + t.top + 'px;font-size:26px;font-weight:600;color:' + GRAY + ';',
          t.label
        );
        el(
          s,
          'left:' +
            TRACKX +
            'px;top:' +
            (t.top + 44) +
            'px;width:' +
            TRACKW +
            'px;height:18px;border-radius:9px;background:#eee9dc;'
        );
        var fill = el(
          s,
          'left:' +
            TRACKX +
            'px;top:' +
            (t.top + 44) +
            'px;width:0;height:18px;border-radius:9px;background:' +
            SPECTRUM +
            ';'
        );
        var num = el(
          s,
          (MOBILE
            ? 'left:' + TRACKX + 'px;top:' + (t.top + 82) + 'px;'
            : 'left:' + (TRACKX + TRACKW + 30) + 'px;top:' + (t.top + 28) + 'px;') +
            'font-size:40px;font-weight:700;color:' +
            INK +
            ';',
          ''
        );
        return { fill: fill, num: num, def: t };
      });
      var TUNES = ['reranking', 'rebalancing', 'retuning'];
      var tuner = el(
        s,
        'left:50%;top:' +
          (MOBILE ? 680 : 440) +
          'px;transform:translateX(-50%);height:80px;padding:0 44px;border-radius:100px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:600;box-sizing:border-box;background:#fff;border:2px solid ' +
          LINE +
          ';color:' +
          GRAY +
          ';white-space:nowrap;'
      );
      var lastTuner = null;

      function render(p) {
        headlineTick(head, seg(p, 0.04, 0.12));
        var locked = p >= 0.62;
        var text = locked ? 'optimized ✓' : TUNES[Math.floor(p * 14) % 3];
        if (text !== lastTuner) {
          tuner.textContent = text;
          lastTuner = text;
          tuner.style.background = locked ? INK : '#fff';
          tuner.style.borderColor = locked ? INK : LINE;
          tuner.style.color = locked ? '#fff' : GRAY;
          tuner.style.boxShadow = locked ? '0 14px 34px rgba(10,10,15,0.15)' : 'none';
        }
        tuner.style.transform =
          'translateX(-50%) scale(' + (1 + 0.08 * bump(p - 0.62, 0.02)) + ')';
        var fade = 1 - seg(p, 0.92, 1);
        tracks.forEach(function (t, k) {
          /* stepwise climb while tuning, settling at target once locked */
          var base = seg(p, 0.1, 0.62, true) * 0.75 + seg(p, 0.62, 0.74) * 0.25;
          var wobble = locked ? 0 : 0.05 * Math.sin(p * 40 + k * 2);
          var v = clamp(base + wobble, 0, 1) * t.def.target * fade;
          t.fill.style.width = TRACKW * v + 'px';
          t.num.textContent = v > 0.02 ? t.def.fmt(v) : '';
          t.num.style.opacity = fade;
        });
        tuner.style.opacity = fade;
      }

      return [{ el: s, dur: 8, render: render }];
    },
    0.8
  );
})();
