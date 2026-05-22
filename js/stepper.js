/*
 * Continuous-scrubber stepper.
 * A range input drives a float value in [0, N-1]; each slide's opacity
 * is computed as a triangular hat function so neighbouring slides
 * cross-fade smoothly as the user scrubs. Prev/Next/tick clicks
 * trigger a short tween between integer steps.
 */
(function () {
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

  function initStepper(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.stepper-slide'));
    var captions = Array.prototype.slice.call(root.querySelectorAll('.caption-slot'));
    var ticks = Array.prototype.slice.call(root.querySelectorAll('.stepper-tick'));
    var range = root.querySelector('.stepper-range');
    var prevBtn = root.querySelector('.stepper-btn[data-action="prev"]');
    var nextBtn = root.querySelector('.stepper-btn[data-action="next"]');

    var total = slides.length;
    if (!range || total === 0) return;

    var maxVal = total - 1;
    range.min = 0;
    range.max = String(maxVal);
    if (!range.step || range.step === '1') range.step = '0.001';

    function render(v) {
      v = clamp(v, 0, maxVal);

      for (var i = 0; i < total; i++) {
        var d = Math.abs(v - i);
        var op = Math.max(0, 1 - d);
        slides[i].style.opacity = String(op);
      }

      for (var j = 0; j < captions.length; j++) {
        var cd = Math.abs(v - j);
        var cop = Math.max(0, 1 - cd);
        captions[j].style.opacity = String(cop);
        captions[j].classList.toggle('is-visible', cop > 0.5);
      }

      var nearest = Math.round(v);
      ticks.forEach(function (t, k) { t.classList.toggle('is-active', k === nearest); });

      range.setAttribute('aria-valuenow', String(nearest + 1));
      range.setAttribute(
        'aria-valuetext',
        'Step ' + (nearest + 1) + ' of ' + total
      );

      if (prevBtn) prevBtn.disabled = v <= 0.001;
      if (nextBtn) nextBtn.disabled = v >= maxVal - 0.001;
    }

    var current = parseFloat(range.value) || 0;
    var tween = null;

    function setValue(v, animate) {
      v = clamp(v, 0, maxVal);
      if (tween) { cancelAnimationFrame(tween); tween = null; }

      if (!animate) {
        current = v;
        range.value = String(v);
        render(v);
        return;
      }

      var start = current;
      var end = v;
      var duration = Math.min(550, 220 + Math.abs(end - start) * 180);
      var t0 = performance.now();

      function ease(p) { return 0.5 - 0.5 * Math.cos(Math.PI * p); }

      function frame(now) {
        var p = clamp((now - t0) / duration, 0, 1);
        var k = ease(p);
        current = start + (end - start) * k;
        range.value = String(current);
        render(current);
        if (p < 1) tween = requestAnimationFrame(frame);
        else { tween = null; current = end; }
      }
      tween = requestAnimationFrame(frame);
    }

    range.addEventListener('input', function () {
      if (tween) { cancelAnimationFrame(tween); tween = null; }
      current = parseFloat(range.value);
      render(current);
    });
    range.addEventListener('change', function () {
      var snap = Math.round(parseFloat(range.value));
      setValue(snap, true);
    });

    function nearInt(v) { return Math.abs(v - Math.round(v)) < 0.02; }
    if (prevBtn) prevBtn.addEventListener('click', function () {
      var target = nearInt(current) ? Math.round(current) - 1 : Math.floor(current);
      setValue(target, true);
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      var target = nearInt(current) ? Math.round(current) + 1 : Math.ceil(current);
      setValue(target, true);
    });
    ticks.forEach(function (t, k) {
      t.addEventListener('click', function () { setValue(k, true); });
    });

    root.addEventListener('keydown', function (e) {
      if (e.target === range) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setValue(Math.round(current) - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setValue(Math.round(current) + 1, true); }
    });
    root.tabIndex = 0;

    setValue(0, false);
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-stepper]'),
      initStepper
    );
  });
})();
