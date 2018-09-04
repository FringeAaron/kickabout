import React, {Component, Fragment} from 'react';
import photo from '../saul.png';

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: this.props.playing,
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
        this.setState({playing: !this.state.playing});
        this.savePlayer(null, !this.state.playing);
    }

    savePlayer(name, playing) {
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        const storedPlayer = playerData.find(player => player.id === this.props.id);
        storedPlayer.name = name || storedPlayer.name;
        storedPlayer.playing = playing !== undefined ? playing : storedPlayer.playing;
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
            <div key={this.props.id} className={"player " + (this.state.playing ? "playing" : "")}>
                <div className="player-photo" onClick={this.handleClick}>
                    {this.props.photo && <img src={photo} />}
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

class PlayerGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: this.props.players,
        }
    }

    render() {
        if (this.props.players.length === 0) {
            return null;
        }
        return (
            <Fragment>
                <h2 className="player-group-name">{this.props.name}</h2>
                <div className="player-group">
                    {this.state.players.map(player => {
                        return PlayerGroup.renderPlayer(player);
                    })}
                </div>
            </Fragment>
        );
    }

    static renderPlayer(player) {
        return (
            <Player
                key={player.id}
                {...player}
            />
        );
    }
}

function PlayingStatus(props) {
    return (
        <div className="nav">
            <h1>{props.playingPlayers} / {props.totalPlayers} players this week</h1>
        </div>
    )
}

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            playingPlayers: 0,
            totalPlayers: 0
        }
    }

    componentDidMount() {
        this.setState({groups: this.getPlayerGroups(this.props.playerData, this.props.positionData)});
    }

    componentDidUpdate(prevProps) {
        console.log('plist updated');
        if (prevProps.playerData !== this.props.playerData) {
            console.log('setting groups');
            this.setState({groups: this.getPlayerGroups(this.props.playerData, this.props.positionData)});
        }
    }

    render() {
        return (
            <div className="player-list">
                {
                    <PlayingStatus playingPlayers={this.props.playerData.filter(player => player.playing).length} totalPlayers={this.props.playerData.length} />
                }
                {
                    this.state.groups.map(group => {
                        const type = Object.keys(group)[0];
                        return (
                            <PlayerGroup
                                key={type}
                                name={type}
                                players={group[type]}
                            />
                        )
                    })
                }
            </div>
        );
    }

    getPlayerGroups(players, positionOrder) {
        const groupedPlayers = [];
        let playingPlayers = 0;
        let totalPlayers = 0;
        if (!players || !players.length) {
            return groupedPlayers;
        }

        const team = Array.from(positionOrder);
        for (let i = 0; i < team.length; i++) {
            const positionGroupName = Object.keys(team[i])[0];
            let playerSubset = [];

            for (let p = 0; p < team[i][positionGroupName].length; p++) {
                const position = team[i][positionGroupName][p];
                playerSubset = playerSubset.concat(players.filter(player => player.position === position));
            }

            groupedPlayers.push({
                [positionGroupName]: playerSubset
            });
        }
        return groupedPlayers;
    }
}

export {Player};