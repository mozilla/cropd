import crop from 'cropd';

const cropper = crop(document.getElementById('cropper-container'), {
  src:
    'https://images.unsplash.com/photo-1418995231169-b6d53c7cdbac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=800'
});

document.getElementById('crop-button').addEventListener('click', () => {
  document.getElementById('output').src = cropper.toDataURL();
});
