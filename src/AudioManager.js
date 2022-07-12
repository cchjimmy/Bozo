export default class AudioManager {
  constructor() {
    this.bGSong = new Audio("../audio/whatDoYouMean.mp3");
    
    this.bGSong.oncanplaythrough = () => {
      console.log("song loaded! Plays song now ...");
      this.bGSong.volume = 1;
      this.bGSong.play();
    }

    this.bGSong.onended = () => {
      this.bGSong.play();
    }
  }
}