const audio = document.getElementById('beep');

class App extends React.Component {
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false
  }

  constructor(props) {
    super(props);
    this.loop = undefined;
  }
  
  componentWillUnmount() {
    clearInterval(this.loop);
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;
    
    if(isPlaying) {
      clearInterval(this.loop);
      
      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      });

      this.loop = setInterval(() => {
        const { 
          clockCount, 
          currentTimer, 
          breakCount, 
          sessionCount 
        } = this.state;
        
        //Changes which timer is playing once time reaches to 0 
        if(clockCount === 0) {
          this.setState({
            currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',
            clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
          });
          
          audio.play();
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
        
      }, 1000);
    }
  }
  /**
   * The handleReset resets the clock to its default state
   */
  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying: false
    });
    
    clearInterval(this.loop);
    
    audio.pause();
    audio.currentTime = 0;
  }

  convertToTime = (count) => {
    //converts the time into a MM:SS format and return the converted time
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
      
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    seconds = seconds < 10 ? ('0' + seconds) : seconds;
    
    return `${minutes}:${seconds}`;
  }
  
  /**
   * The handleLengthChange function is triggered when the user clicks the
   * increase or decrease button to adjust their timer length for their breaks
   * and sessions. It takes in count (1 or -1) and timerType ('break' or 'session') and 
   * makes the changes depending on the button that was clicked.
   */
  handleLengthChange = (count, timerType) => {
    const { 
      sessionCount, 
      breakCount, 
      isPlaying, 
      currentTimer
    } = this.state;
    
    let newCount;
    
    if(timerType === 'session') {
      newCount = sessionCount + count;
    } else {
      newCount = breakCount + count;
    }
    
    if(newCount > 0 && newCount < 61 && !isPlaying) {
      this.setState({
        [`${timerType}Count`]: newCount
      });
      
      if(currentTimer.toLowerCase() === timerType) {
        this.setState({
          clockCount: newCount * 60
        })
      }
    }
  }

  render() {
    const { 
      breakCount, 
      sessionCount, 
      clockCount, 
      currentTimer,
      isPlaying
    } = this.state;
    
    const breakProps = {
      title: 'Break',
      count: breakCount,
      handleDecrease: ()=>this.handleLengthChange(-1,"break"),
      handleIncrease: ()=>this.handleLengthChange(1,"break")
    }
    
    const sessionProps = {
      title: 'Session',
      count: sessionCount,
      handleDecrease: ()=>this.handleLengthChange(-1,"session"),
      handleIncrease: ()=>this.handleLengthChange(1,"session"),
    }
    
    return (
      <div>
        <div className="flex">
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>
        
        <div className="clock-container">
          <h1 id="timer-label">{currentTimer}</h1>
          <span id="time-left">{this.convertToTime(clockCount)}</span>
          
          
          <div className="flex">
            <button id="start_stop" className="btn btn-primary" onClick={this.handlePlayPause}>
              <i className={`fas fa-${isPlaying ? 'pause': 'play'}`} />
            </button>
            <button id="reset" className="btn btn-warning" onClick={this.handleReset}>
              <i className="fas fa-sync" />
            </button>
          </div>
        </div>
      </div>);
  }
}

/* The SetTimer component creates the buttons that will trigger the onClick event that will increase/decrease the length of 
session and break and set their ID's according to their props it receives */
const SetTimer = (props) => {
  const id = props.title.toLowerCase();
  
  return (
    <div className="timer-container">
      <h2 id={`${id}-label`}>
        {props.title} Length
      </h2>
      <div className="flex actions-wrapper">
        <button id={`${id}-decrement`} className="btn btn-danger" onClick={props.handleDecrease}>
          <i className="fas fa-minus" />
        </button>
        
        <span id={`${id}-length`}>{props.count}</span>
        
        <button id={`${id}-increment`} className="btn btn-success" onClick={props.handleIncrease}>
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById('app'));