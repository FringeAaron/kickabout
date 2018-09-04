import React, {Component} from 'react';
import photo from '../saul.png';

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //playing: this.props.playing,
            editing: false,
            name: this.props.name
        };

        this.handleClick = this.handleClick.bind(this);
        this.editPlayer = this.editPlayer.bind(this);
        this.checkSubmit = this.checkSubmit.bind(this);
        this.resetName = this.resetName.bind(this);

        this.nameInput = null;

    }

    handleClick() {
        //this.setState({playing: !this.state.playing});
        //this.savePlayer(null, !this.state.playing);
        this.props.setIsPlaying(this);
    }

    savePlayer(name, playing) {
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        const storedPlayer = playerData.find(player => player.id === this.props.id);
        storedPlayer.name = name || storedPlayer.name;
        //storedPlayer.playing = playing !== undefined ? playing : storedPlayer.playing;
        localStorage.setItem("playerData", JSON.stringify(playerData));
    }

    componentDidUpdate() {
        if (this.state.editing && this.nameInput) {
            this.nameInput.focus();
        }
    }

    editPlayer() {
        this.setState({editing: true});
    }

    checkSubmit(e) {
        if (e.keyCode === 13) {
            this.setState({name: e.target.value});
            this.setState({editing: false});
            this.savePlayer(e.target.value);
        }
    }
    resetName(e) {
        e.target.value = this.state.name;
        this.setState({editing: false});
    }

    render() {
        return (
            <div key={this.props.id} className={"player " + (this.props.playing ? "playing" : "")}>
                <div className="player-photo" onClick={this.handleClick}>
                    {this.props.photo && <img src={photo} alt="player" />}
                </div>
                {!this.state.editing && <h3 onClick={this.editPlayer}>{this.state.name}</h3>}
                {
                    this.state.editing && (
                        <input
                            type="text"
                            defaultValue={this.state.name}
                            onBlur={e => this.resetName(e)}
                            onKeyUp={e => this.checkSubmit(e)}
                            ref={(el) => {this.nameInput = el}}
                        />
                    )
                }
                {this.props.position}
            </div>
        );
    }
}

export {Player};