<script>
  import { createEventDispatcher } from 'svelte';
  import Draggable from './draggable.svelte';

  const dispatch = createEventDispatcher();

  const HANDLE_DIRECTIONS = {
    1: 'nw',
    2: 'n',
    3: 'ne',
    4: 'w',
    6: 'e',
    7: 'sw',
    8: 's',
    9: 'se'
  };
  const BORDER = '2px solid white';
  const HANDLE_STYLES = [
    i => (i <= 3 ? `border-top: ${BORDER};` : ''),
    i => (i >= 7 ? `border-bottom: ${BORDER}; align-self: flex-end;` : ''),
    i => (i % 3 === 1 ? `border-left: ${BORDER};` : ''),
    i => (i % 3 === 0 ? `border-right: ${BORDER}; margin-left: auto;` : ''),
    i => (i === 2 || i === 8 ? 'margin: 0 auto; cursor: ns-resize;' : ''),
    i => (i === 4 || i === 6 ? 'align-self: center; cursor: ew-resize;' : ''),
    i => (i === 1 || i === 9 ? 'cursor: nwse-resize;' : ''),
    i => (i === 3 || i === 7 ? 'cursor: nesw-resize;' : '')
  ];

  export let n;
  let style = '';
  $: style = HANDLE_STYLES.map(styleFn => styleFn(n)).join(' ');
</script>

<Draggable
  style={'width: 40%; height: 40%;' + style}
  on:drag={event => dispatch('resize', {offset: event.detail, key: HANDLE_DIRECTIONS[n]})}
>
  <div style={'width: 100%; height: 100%; box-sizing: border-box;' + style + 'border-color: black; border-width: 2px;'}></div>
</Draggable>