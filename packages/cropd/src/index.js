import Cropper from './cropper.svelte';

export default function crop(target, props) {
  return new Cropper({
    target,
    props
  });
}
