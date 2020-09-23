const template = document.createElement('template');
template.innerHTML = `
  <div class="video-container">
    <video id="video-box"></video>
    <div id="controls">
      <div class="top">
        <div id="play-pause"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M2 24v-24l20 12-20 12z"/></svg></div>
        <div class="time"><span id="currentTime">00:00</span><span id="duration">00:00</span></div>
      </div>
      <div class="bottom">
        <input id="seek-bar" type="range" min="0" max="100" value="0" step="1" />
        <div id="sound-controls">
          <svg id="sound-icon" data-muted="un-muted" width="25" height="25" xmlns="http://www.w3.org/2000/svg"  fill-rule="evenodd" clip-rule="evenodd"><path d="M15 23l-9.309-6h-5.691v-10h5.691l9.309-6v22zm-9-15.009v8.018l8 5.157v-18.332l-8 5.157zm14.228-4.219c2.327 1.989 3.772 4.942 3.772 8.229 0 3.288-1.445 6.241-3.77 8.229l-.708-.708c2.136-1.791 3.478-4.501 3.478-7.522s-1.342-5.731-3.478-7.522l.706-.706zm-2.929 2.929c1.521 1.257 2.476 3.167 2.476 5.299 0 2.132-.955 4.042-2.476 5.299l-.706-.706c1.331-1.063 2.182-2.729 2.182-4.591 0-1.863-.851-3.529-2.184-4.593l.708-.708zm-12.299 1.299h-4v8h4v-8z"/></svg>
          <input id="sound-bar" type="range" min="0" max="1" value=".5" step=".1" />
        </div>

      </div>
    </div>
  </div>
`;
class customVideo extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback(){
    let videoBox = this.shadowRoot.querySelector('#video-box'),
        seekbar = this.shadowRoot.querySelector('#seek-bar'),
        soundBar = this.shadowRoot.querySelector('#sound-bar'),
        playPause = this.shadowRoot.querySelector('#play-pause'),
        soundIcon = this.shadowRoot.querySelector('#sound-icon'),
        controls = this.shadowRoot.querySelector('#controls'),
        currentTime = this.shadowRoot.querySelector('#currentTime'),
        duration = this.shadowRoot.querySelector('#duration');
    let holdingClick = false;

    if(this.getAttribute('src')){
      videoBox.src = this.getAttribute('src');
    }

    // GET THE VIDEO DURATION
    videoBox.onloadeddata = function () {
      let currentMin = Math.floor(videoBox.duration / 60),
          currentSec = Math.floor(videoBox.duration - currentMin * 60);
          currentMin = currentMin >= 10 ? currentMin : '0' + currentMin;
          currentSec = currentSec >= 10 ? currentSec : '0' + currentSec;

      duration.textContent = currentMin + ':' + currentSec;
      console.log(currentMin, currentSec);
      seekbar.value = 0;
    }

    //CHECK FOR TH ATTRIBUTES
    if(this.getAttribute('controls-bg')){
      controls.style.background = this.getAttribute('controls-bg');
    }
    if(this.getAttribute('text-color')){
      currentTime.style.color = this.getAttribute('text-color');
      duration.style.color = this.getAttribute('text-color');
    }

    //  PLAY OR PAUSE THE VIDEO
    playPause.addEventListener('click', function () {
      if (videoBox.paused) {
        videoBox.play();
        playPause.innerHTML = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" viewBox="0 0 24 24" stroke="#0075ff" stroke-width="3" clip-rule="evenodd"><path d="M10 24h-6v-24h6v24zm10 0h-6v-24h6v24zm-11-23h-4v22h4v-22zm10 0h-4v22h4v-22z"/></svg>';
      } else {
        videoBox.pause();
        playPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M2 24v-24l20 12-20 12z"/></svg>';
      }
    });

    //////
    seekbar.addEventListener('mousedown', function () {
      holdingClick = true;
    })
    seekbar.addEventListener('mouseup', function () {
      holdingClick = false;
    })
    //////

    // GET AN SPECIFIC TIME ON THE VIDEO BY USING SEEKBAR
    seekbar.addEventListener('change', function () {
      var seekto = videoBox.duration * (seekbar.value / 100);
      videoBox.currentTime = seekto;
    });

    // UPDATE TIME AND SEEK BAR
    videoBox.addEventListener('timeupdate', function () {
      let leftTime = videoBox.currentTime * (100 / videoBox.duration),
          currentMin = Math.floor(videoBox.currentTime / 60),
          currentSec = Math.floor(videoBox.currentTime - currentMin * 60),
          durationMin = Math.floor(videoBox.duration / 60),
          durationSec = Math.floor(videoBox.duration - durationMin * 60);
      currentSec = currentSec >= 10 ? currentSec : "0" + currentSec;
      currentMin = currentMin >= 10 ? currentMin : "0" + currentMin;
      durationSec = durationSec >= 10 ? durationSec : "0" + durationSec;
      durationMin = durationMin >= 10 ? durationMin : "0" + durationMin;
      if(!holdingClick){
        seekbar.value = leftTime;
      }
      currentTime.textContent = currentMin + ":" + currentSec;
      duration.textContent = durationMin + ":" + durationSec;
    });

    // MUTE
    soundIcon.addEventListener('click', function (e) {
      if(e.target.dataset.muted === "muted"){
        e.target.style.fill = 'var(--main-color)';
        e.target.setAttribute('data-muted', "un-muted");
        videoBox.muted = false;
      } else{
        e.target.style.fill = '#aaa';
        e.target.setAttribute('data-muted', "muted");
        videoBox.muted = true;
      }
    })

    // UPDATE VOLUME
    soundBar.addEventListener('change', function (e) {
      videoBox.volume = e.target.value;
    })

    //ON ENDED
    videoBox.addEventListener('ended', function () {
      playPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M2 24v-24l20 12-20 12z"/></svg>';
    })
    
  }
}


let style = `<style>
  .video-container
  {
    position: relative;
    overflow: hidden;
    --main-color: #0075ff;
    width: auto;
    height: auto
  }
  .video-container:hover #controls{
    transform: translate(-50%, 0);
  }
  svg{
    fill: var(--main-color);
  }
  #video-box
  {
    width: 100%;
    height: 100%;
  }
  #controls
  {
    position: absolute;
    width: 95%;
    left: 50%;
    bottom: 5px;
    transform: translate(-50%, 110%);
    transition: .8s ease;
    background: rgba(255,255,255,.92);
    padding: .25rem .5rem;
    box-shadow: 0 0 15px #222;
  }
  #controls .top, #controls .bottom, #sound-controls{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #play-pause
  {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: var(--main-color);
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--main-color);
  }
  #play-pause:hover
  {
    border-color: #fff;
    background: var(--main-color);
  }
  #play-pause:hover svg
  {
    fill: #fff;
    stroke: #fff
  }
  #currentTime, #duration
  {
    color: var(--main-color);
    bottom: 5px;
  }
  #currentTime
  {
    margin: 0 15px;
  }
  #duration
  {
  }
  #seek-bar
  {
    flex-grow: 2;
    min-width: 200px;
  }

  #sound-icon{
    cursor: pointer;
  }
  #sound-bar{
    display: inline-block;
    width: 100px;
    min-width: 50px;
    height: 2px;
    margin-left: 3px;
  }
</style>`;
template.innerHTML += style;

window.customElements.define('custom-video', customVideo)
