module.exports = fileTypeHandler;

function fileTypeHandler(filename) {
  if (filename.toLowerCase().includes('.mp4')) {
    return 2;
  } else if (filename.toLowerCase().includes('.mp3')) {
    return 3;
  } else return 1;
}
