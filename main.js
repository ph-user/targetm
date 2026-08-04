/* Focus Media AU — lightweight interactions (restrained, no heavy motion) */
(function () {
  'use strict';

  /* Mobile menu toggle */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') menu.classList.remove('open');
    });
  }

  /* Transparent overlay nav — turns into a blurred solid bar once scrolled. */
  var navOverlay = document.querySelector('.nav-overlay, .nav-overlay-light');
  if (navOverlay) {
    var navTicking = false;
    var updateNavSolid = function () {
      navOverlay.classList.toggle('solid', window.scrollY > 80);
      navTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(updateNavSolid);
    }, { passive: true });
    updateNavSolid();
  }

  /* Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Platform showcase — screen model switcher (tabs + side arrows) with a
     restrained pointer-tilt on the product visual. */
  var stage = document.querySelector('.stage-3d');
  if (stage) {
    var MODELS = [
      { name: '25-inch Smart LCD', img: 'assets/25-png.png',
        alt: '25-inch Focus Media screen installed inside a lift' },
      { name: '32-inch Smart LCD', img: 'assets/32-png.png',
        alt: '32-inch Focus Media screen wall-mounted in a corridor' },
      { name: '55-inch Smart LCD', img: 'assets/55-png.png',
        alt: '55-inch Focus Media freestanding screen at a building entrance' }
    ];
    var img = document.getElementById('modelImg');
    var elCaption = document.getElementById('modelCaption');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.model-tab'));
    var idx = 0;

    function render(i) {
      idx = (i + MODELS.length) % MODELS.length;
      var m = MODELS[idx];
      if (img) {
        img.style.opacity = '0';
        img.onload = function () { img.style.opacity = '1'; };
        img.src = m.img;
        img.alt = m.alt;
      }
      if (elCaption) elCaption.textContent = m.name;
      tabs.forEach(function (t, k) {
        var on = k === idx;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { render(k); }); });
    var prevBtn = stage.querySelector('.stage-arrow.prev');
    var nextBtn = stage.querySelector('.stage-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { render(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { render(idx + 1); });

    var product = document.getElementById('modelProduct');
    var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (product && fineHover && !reduceMotion) {
      stage.addEventListener('pointermove', function (e) {
        var r = product.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        product.style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (y * -10) + 'deg)';
      });
      stage.addEventListener('pointerleave', function () { product.style.transform = ''; });
    }
  }

  /* Transformation slider — drag (or arrow keys) to compare before/after,
     with a one-time cinematic sweep-in from the right when it scrolls into view. */
  var ba = document.getElementById('ba');
  if (ba) {
    var baAfter = document.getElementById('baAfter');
    var baHandle = document.getElementById('baHandle');
    var baTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    var baReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pos = 50, targetPos = 50, baRaf = null;

    function baPaint(v) {
      baAfter.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      baHandle.style.left = v + '%';
      ba.setAttribute('aria-valuenow', String(Math.round(v)));
    }
    function baRender() {
      pos += (targetPos - pos) * 0.16;
      baPaint(pos);
      if (Math.abs(targetPos - pos) > 0.05) baRaf = requestAnimationFrame(baRender);
      else baRaf = null;
    }
    function baSetFrom(clientX) {
      var r = ba.getBoundingClientRect();
      targetPos = Math.min(98, Math.max(2, ((clientX - r.left) / r.width) * 100));
      if (!baRaf) baRaf = requestAnimationFrame(baRender);
    }
    var baDragging = false;
    ba.addEventListener('pointerdown', function (e) {
      baDragging = true;
      ba.setPointerCapture(e.pointerId);
      baSetFrom(e.clientX);
    });
    ba.addEventListener('pointermove', function (e) {
      if (baDragging || (!baTouch && e.pointerType === 'mouse')) baSetFrom(e.clientX);
    });
    window.addEventListener('pointerup', function () { baDragging = false; });
    ba.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { targetPos = Math.max(2, targetPos - 6); if (!baRaf) baRaf = requestAnimationFrame(baRender); }
      if (e.key === 'ArrowRight') { targetPos = Math.min(98, targetPos + 6); if (!baRaf) baRaf = requestAnimationFrame(baRender); }
    });

    if (baReduce) {
      baPaint(50);
    } else if ('IntersectionObserver' in window) {
      var baIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          baIo.unobserve(en.target);
          pos = 98; targetPos = 98;
          baPaint(98);
          var start = null, from = 98, to = 50, dur = 900;
          function sweep(ts) {
            if (!start) start = ts;
            var t = Math.min(1, (ts - start) / dur);
            var eased = 1 - Math.pow(1 - t, 3);
            var v = from + (to - from) * eased;
            pos = v; targetPos = v;
            baPaint(v);
            if (t < 1) requestAnimationFrame(sweep);
          }
          requestAnimationFrame(sweep);
        });
      }, { threshold: 0.35 });
      baIo.observe(ba);
    } else {
      baPaint(50);
    }
  }

  /* Partnership step timeline — rail fills top to bottom as the section scrolls through view. */
  var railFill = document.getElementById('railFill');
  var stepTrack = document.querySelector('.step-track');
  if (railFill && stepTrack) {
    var railReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (railReduce) {
      railFill.style.transform = 'scaleY(1)';
    } else {
      var railTicking = false;
      var updateRail = function () {
        var vh = window.innerHeight;
        var r = stepTrack.getBoundingClientRect();
        var startTop = vh * 0.75;
        var endTop = vh * 0.35 - r.height;
        var p = startTop === endTop ? 0 : (startTop - r.top) / (startTop - endTop);
        p = Math.min(1, Math.max(0, p));
        railFill.style.transform = 'scaleY(' + p + ')';
        railTicking = false;
      };
      var onRailScroll = function () {
        if (railTicking) return;
        railTicking = true;
        requestAnimationFrame(updateRail);
      };
      window.addEventListener('scroll', onRailScroll, { passive: true });
      window.addEventListener('resize', onRailScroll);
      updateRail();
    }
  }

  /* Testimonials — rolling avatar rail, auto-advances every 3s only (no manual selection). */
  var testiRail = document.getElementById('testiRail');
  if (testiRail) {
    var TESTIMONIALS = [
      { name: 'Diana Johnston', role: 'Body Corporate Chair · Southbank, VIC',
        text: 'The committee approved it after a single meeting. Six months on, our lobby looks like a hotel and the notices finally get read.' },
      { name: 'Lauren Contreras', role: 'Building Manager · Docklands, VIC',
        text: 'We’ve stopped printing notices altogether. Residents check the screen on their way to the lift instead of skimming past a noticeboard.' },
      { name: 'Edward Alexander', role: 'Facilities Director · Box Hill, VIC',
        text: 'Zero cost was the reason we said yes. Zero maintenance is why we’ve now rolled it out across three more buildings.' }
    ];
    var testiPersons = Array.prototype.slice.call(testiRail.querySelectorAll('.testi-person'));
    var testiDot = document.getElementById('testiDot');
    var testiText = document.getElementById('testiText');
    var testiCite = document.getElementById('testiCite');
    var testiReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tIdx = 0, tTimer = null;

    function positionDot() {
      var active = testiPersons[tIdx];
      if (!active || !testiDot) return;
      testiDot.style.top = (active.offsetTop + active.offsetHeight / 2 - 4) + 'px';
    }
    function renderTesti(i, animate) {
      tIdx = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
      testiPersons.forEach(function (p, k) { p.classList.toggle('is-on', k === tIdx); });
      positionDot();
      var apply = function () {
        if (testiText) testiText.textContent = TESTIMONIALS[tIdx].text;
        if (testiCite) testiCite.textContent = TESTIMONIALS[tIdx].name + ' — ' + TESTIMONIALS[tIdx].role;
      };
      if (animate === false || !testiText || testiReduce) { apply(); return; }
      testiText.classList.add('is-out');
      setTimeout(function () {
        apply();
        testiText.classList.remove('is-out');
      }, 220);
    }
    window.addEventListener('resize', positionDot);

    renderTesti(0, false);
    if (!testiReduce) tTimer = setInterval(function () { renderTesti(tIdx + 1); }, 3000);
  }

  /* Free assessment form — submits to FormSubmit.co via fetch, so the page
     never leaves and the existing inline thank-you/error panels can be used.
     Falls back to a normal HTML POST (form's action/method) if JS is unavailable. */
  var form = document.querySelector('.assessment-form');
  if (form && form.action) {
    var ajaxAction = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.innerHTML : '';
    var ok = document.getElementById('form-ok');
    var err = document.getElementById('form-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (err) err.classList.remove('show');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch(ajaxAction, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.querySelector('.form-grid').style.display = 'none';
        if (ok) { ok.classList.add('show'); ok.focus(); }
      }).catch(function () {
        if (err) { err.classList.add('show'); err.focus(); }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      });
    });
  }
})();
