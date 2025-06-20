const canvas = document.getElementById('art');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volume = document.getElementById('volume');
const timerInput = document.getElementById('timer');
const setTimer = document.getElementById('setTimer');
const themeSelect = document.getElementById('theme');

// simple 8x8 pixel sprites for album art
const sprites = [
  [
    '22222222',
    '2ff22ff2',
    '2ff22ff2',
    '22222222',
    '22ffff22',
    '22ffff22',
    '22222222',
    '22222222'
  ],
  [
    '22333322',
    '23333332',
    '33333333',
    '33333333',
    '33333333',
    '33333333',
    '23333332',
    '22333322'
  ],
  [
    '24444442',
    '24444442',
    '44444444',
    '44444444',
    '44444444',
    '44444444',
    '24444442',
    '24444442'
  ]
];
const colors = {
  '2': '#331a00',
  '3': '#774400',
  '4': '#ffcc33',
  'f': '#ff7777'
};

function drawSprite(data){
  const scale = 8;
  canvas.width = data[0].length * scale;
  canvas.height = data.length * scale;
  ctx.imageSmoothingEnabled = false;
  for(let y=0; y<data.length; y++){
    for(let x=0; x<data[y].length; x++){
      const c = colors[data[y][x]] || '#000';
      ctx.fillStyle = c;
      ctx.fillRect(x*scale, y*scale, scale, scale);
    }
  }
}

// tiny mp3 samples encoded as data URIs (simple beeps)
const tracks = [
  'data:audio/mpeg;base64,//uQxAADBQAAQAEAN0AAAB9AAACcQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'data:audio/mpeg;base64,//uQxAALBQAAQAEAN0AAAB9AAACcQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'data:audio/mpeg;base64,//uQxAATBQAAQAEAN0AAAB9AAACcQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
];
let trackIndex = 0;
const audio = new Audio(tracks[trackIndex]);
audio.loop = true;
audio.volume = volume.value;

function loadTrack(i){
  trackIndex = (i + tracks.length) % tracks.length;
  audio.src = tracks[trackIndex];
  drawSprite(sprites[trackIndex]);
}

playBtn.addEventListener('click', () => {
  if(audio.paused){
    audio.play();
    playBtn.textContent = 'Pause';
  } else {
    audio.pause();
    playBtn.textContent = 'Play';
  }
});

prevBtn.addEventListener('click', () => {
  loadTrack(trackIndex - 1);
  if(!audio.paused) audio.play();
});

nextBtn.addEventListener('click', () => {
  loadTrack(trackIndex + 1);
  if(!audio.paused) audio.play();
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

let timerId = null;
setTimer.addEventListener('click', () => {
  if(timerId) clearTimeout(timerId);
  const minutes = parseInt(timerInput.value, 10) || 0;
  if(minutes > 0){
    timerId = setTimeout(() => { audio.pause(); playBtn.textContent = 'Play'; }, minutes * 60000);
  }
});

themeSelect.addEventListener('change', () => {
  document.body.className = 'theme-' + themeSelect.value;
});

loadTrack(0);

