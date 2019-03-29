<script>
  import { afterUpdate, onMount } from 'svelte';
  import Draggable from './draggable.svelte';
  import Handle from './handle.svelte';

  const MIN_SCALE = 50;
  const ONE_THIRD = 100 / 3 + '%';

  export let src = '';

  let prevSrc = '';
  let img;

  let center = [0.5, 0.5];

  let width = 0;
  let height = 0;
  let scale = 0;

  let left;
  $: left = center[0] * width - scale / 2;
  let top;
  $: top = center[1] * height - scale / 2;

  onMount(init);

  afterUpdate(init);

  async function init() {
    if (prevSrc == src) return;
    prevSrc = src;

    if (!img.complete) {
      await new Promise(resolve => img.addEventListener('load', resolve));
    }
    const bounds = img.getBoundingClientRect();

    width = bounds.width;
    height = bounds.height;
    scale = Math.max(Math.min(width, height) * 0.5, MIN_SCALE);
  }

  function clamp(min, n, max) {
    return Math.min(Math.max(n, min), max);
  }

  function move({ x, y }) {
    const halfWidth = scale / 2 / width;
    const halfHeight = scale / 2 / height;
    center = [
      clamp(halfWidth, center[0] + x / width, 1 - halfWidth),
      clamp(halfHeight, center[1] + y / height, 1 - halfHeight)
    ];
  }

  function resize({ offset: { x, y }, key }) {
    const isXResize = Math.abs(x) > Math.abs(y);
    const isXFlip = key.includes('w');
    const isYFlip = key.includes('n');
    const diff =
      (isXResize ? (isXFlip ? -1 : 1) * x : (isYFlip ? -1 : 1) * y) * 2;
    const newScale = Math.min(
      Math.max(scale + diff * 0.5, MIN_SCALE),
      width,
      height
    );
    if (scale !== newScale) {
      scale = newScale;
      move({
        x: (key === 's' || key === 'n' ? 0 : (isXFlip ? -1 : 1) * diff) / 4,
        y: (key === 'w' || key === 'e' ? 0 : (isYFlip ? -1 : 1) * diff) / 4
      });
    }
  }

  export function toDataURL(...args) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const factor = img.naturalWidth / width;
    const s = factor * scale;
    canvas.width = s;
    canvas.height = s;
    ctx.drawImage(img, left * factor, top * factor, s, s, 0, 0, s, s);
    return canvas.toDataURL(...args);
  }
</script>

<div
  style={[
    'position: relative;',
    'overflow: hidden;',
    'user-select: none;',
    '-moz-user-select: none;',
    '-webkit-user-select: none;'
  ].join('')}
>
	<img
    bind:this="{img}"
    src="{src}"
    alt=""
    crossorigin="anonymous"
    style="max-width: 100%; filter: brightness(0.4);"
  />
  <img
    src="{src}"
    alt=""
    crossorigin="anonymous"
    style={[
      'max-width: 100%;',
      'position: absolute;',
      'left: 0;',
      'top: 0;',
      `clip: rect(${top}px, ${left + scale}px, ${top + scale}px, ${left}px);`,
      'cursor: pointer;',
    ].join('')}
  />
  <Draggable
    style={[
      'position: absolute;',
      'display: flex;',
      'flex-wrap: wrap;',
			`top: ${top}px;`,
      `left: ${left}px;`,
      `width: ${scale}px;`,
      `height: ${scale}px;`
    ].join('')}
    on:drag={event => move(event.detail)}
  >
    {#each Array.apply(null, {length: 9}).map((_, i) => i + 1, Number) as n (n)}
      <div
        style={[
          `width: ${ONE_THIRD};`,
          `height: ${ONE_THIRD};`,
          n > 3 ? 'border-top: 0;' : '',
          n % 3 !== 0 ? 'border-right: 0;' : '',
          'display: flex;',
          'border: 1px solid rgba(255, 255, 255, 0.3);',
          'box-sizing: border-box;',
          'overflow: hidden;',
          'cursor: move;'
        ].join('')}
      >
        {#if n != 5}
          <Handle n={n} on:resize={event => resize(event.detail)}/>
        {/if}
      </div>
    {/each}
  </Draggable>
</div>
