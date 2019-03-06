<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let style;

  let root;

  let active = false;
  let lastX = null;
  let lastY = null;

  function dragStart(event) {
    event.stopImmediatePropagation();
    active = true;
  }

  function dragEnd() {
    lastX = null;
    lastY = null;
    active = false;
  }

  function drag(event) {
    if (!active) {
      return;
    }

    event.preventDefault();
    let currentX;
    let currentY;
    if (event.type === 'touchmove') {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }

    if (lastX != null && lastY != null) {
      dispatch('drag', { x: currentX - lastX, y: currentY - lastY });
    }

    lastX = currentX;
    lastY = currentY;
  }
</script>

<svelte:window
  on:touchend={dragEnd}
  on:touchmove={drag}
  on:mouseup={dragEnd}
  on:mousemove={drag}
/>
<div
  bind:this={root}
  style={style}
  on:touchstart={dragStart}
  on:mousedown={dragStart}
>
  <slot/>
</div>
