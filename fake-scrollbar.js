(() => {
  const SELECTOR = ".chat, .settings-content, .media-content";
  const bars = new Map();
  let activeDrag = null;

  function getScrollContainers(){
    return Array.from(document.querySelectorAll(SELECTOR));
  }

  function isVisible(el){
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function ensureBar(el){
    if(bars.has(el)) return bars.get(el);

    const bar = document.createElement("div");
    bar.className = "fake-scrollbar";

    const thumb = document.createElement("div");
    thumb.className = "fake-scrollbar-thumb";
    bar.appendChild(thumb);
    document.body.appendChild(bar);

    el.addEventListener("scroll", () => updateBar(el), { passive:true });

    bar.addEventListener("mousedown", e => {
      if(e.target === thumb) return;
      jumpToTrackPosition(el, e.clientY);
    });

    bar.addEventListener("touchstart", e => {
      if(e.target === thumb) return;
      const t = e.touches && e.touches[0];
      if(t) jumpToTrackPosition(el, t.clientY);
    }, { passive:false });

    const startDrag = e => {
      e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      activeDrag = {
        el,
        bar,
        thumb,
        startY:clientY,
        startScrollTop:el.scrollTop
      };
      bar.classList.add("dragging");
    };

    thumb.addEventListener("mousedown", startDrag);
    thumb.addEventListener("touchstart", startDrag, { passive:false });

    const info = { bar, thumb };
    bars.set(el, info);
    return info;
  }

  function getMetrics(el){
    const rect = el.getBoundingClientRect();
    const scrollRange = el.scrollHeight - el.clientHeight;
    const visibleRatio = el.clientHeight / el.scrollHeight;
    const thumbHeight = Math.max(36, Math.round(rect.height * visibleRatio));
    const trackRange = Math.max(1, rect.height - thumbHeight);
    const thumbTop = scrollRange <= 0 ? 0 : (el.scrollTop / scrollRange) * trackRange;
    return { rect, scrollRange, thumbHeight, trackRange, thumbTop };
  }

  function updateBar(el){
    const { bar, thumb } = ensureBar(el);

    if(!isVisible(el) || el.scrollHeight <= el.clientHeight + 1){
      bar.style.display = "none";
      return;
    }

    const { rect, thumbHeight, thumbTop } = getMetrics(el);

    bar.style.display = "block";
    bar.style.top = `${rect.top}px`;
    bar.style.left = `${rect.right - 14}px`;
    bar.style.height = `${rect.height}px`;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.top = `${thumbTop}px`;
  }

  function updateAll(){
    const containers = getScrollContainers();
    containers.forEach(ensureBar);
    containers.forEach(updateBar);

    for(const [el, info] of bars.entries()){
      if(!document.body.contains(el)){
        info.bar.remove();
        bars.delete(el);
      }
    }
  }

  function jumpToTrackPosition(el, clientY){
    const { rect, thumbHeight, trackRange, scrollRange } = getMetrics(el);
    if(scrollRange <= 0) return;

    const thumbTop = Math.min(
      trackRange,
      Math.max(0, clientY - rect.top - thumbHeight / 2)
    );

    el.scrollTop = (thumbTop / trackRange) * scrollRange;
    updateBar(el);
  }

  function onDragMove(e){
    if(!activeDrag) return;
    e.preventDefault();

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const { el, startY, startScrollTop } = activeDrag;
    const { trackRange, scrollRange } = getMetrics(el);
    const delta = clientY - startY;

    el.scrollTop = startScrollTop + (delta / trackRange) * scrollRange;
    updateBar(el);
  }

  function endDrag(){
    if(activeDrag){
      activeDrag.bar.classList.remove("dragging");
      activeDrag = null;
    }
  }

  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", onDragMove, { passive:false });
  document.addEventListener("touchend", endDrag);
  window.addEventListener("resize", updateAll);
  window.addEventListener("hashchange", () => setTimeout(updateAll, 50));

  const observer = new MutationObserver(() => updateAll());
  observer.observe(document.body, { childList:true, subtree:true });

  document.addEventListener("DOMContentLoaded", updateAll);
  window.addEventListener("load", updateAll);
  setInterval(updateAll, 500);
})();
