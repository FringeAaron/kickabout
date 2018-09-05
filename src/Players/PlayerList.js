import React, {Component, Fragment} from 'react';
import {Player} from "./Player";
import playerData from '../Data/players.json';
import positionData from '../Data/positions.json';
import {hydrateStateWithLocalStorage, saveStateToLocalStorage} from './localstorage.js';
import {blendRGBColors} from './utils.js';
import './player.css';

function PlayingStatus(props) {
    return (
        <div className="player-status-bar">
            <span className="numbers playing">{props.playingPlayers}</span><span className="numbers"> / {props.totalPlayers}</span> <span>players this week</span>
        </div>
    )
}

class PlayerList extends Component {

    statusBarEl;
    playingEl;

    constructor(props) {
        super(props);
        this.state = {
            playerData: [],
            positionData: [],
            groups: [],
        };

        this.setIsPlaying = this.setIsPlaying.bind(this);
    }

    componentDidMount() {
        hydrateStateWithLocalStorage(this).then((result) => {
            if (this.state.playerData.length === 0) {
                const playerData = PlayerList.getPlayerData();
                const positionData = PlayerList.getPositionData();
                this.setState({
                    playerData: playerData,
                    positionData: positionData,
                    groups: this.getPlayerGroups(playerData, positionData)
                }, () => {
                    console.log('saving state', this.state);
                    saveStateToLocalStorage(this);
                });
            }
            this.updatePlayerStatusBar();
        });
    }

    render() {
        return (
            <div className="player-list">
                {
                    <PlayingStatus playingPlayers={this.state.playerData.filter(player => player.playing).length} totalPlayers={this.state.playerData.length}/>
                }
                {
                    this.state.groups.map(group => {
                        const type = Object.keys(group)[0];
                        if (group[type].length > 0) {
                            return (
                                <Fragment key={type}>
                                    <h2 className="player-group-name">{type}</h2>
                                    <div className="player-group">
                                        {group[type].map(player => {
                                            const actualPlayer = this.state.playerData.find(p => p.id === player.id);
                                            return (
                                                <Player
                                                    key={actualPlayer.id}
                                                    {...actualPlayer}
                                                    setIsPlaying={this.setIsPlaying}
                                                />
                                            );
                                        })}
                                    </div>
                                </Fragment>
                            )
                        }
                        return null;
                    })
                }
            </div>
        );
    }

    setIsPlaying = (e) => {
        this.setState(({playerData}) => {
            const man = playerData.find(p => p.id === e.props.id);
            man.playing = !man.playing;
            return man;
        }, () => {
            saveStateToLocalStorage(this);
            this.updatePlayerStatusBar();
        })
    };

    updatePlayerStatusBar() {
        if (!this.statusBarEl) {
            this.statusBarEl = document.querySelector('.player-status-bar');
            this.playingEl = document.querySelector('.player-status-bar .playing');
        }

        this.statusBarEl.classList.add('highlight');
        setTimeout(() => {
            this.statusBarEl.classList.remove('highlight');
        }, 200);

        const playing = this.state.playerData.filter(player => player.playing).length;

        let colour = "rgb(94,241,187)";
        if (playing < 10) {
            let badColour = "rgb(100,0,1)";
            colour = blendRGBColors(badColour, colour, (playing / 10));
        }
        this.statusBarEl.style.setProperty('background-color', colour);

        if (playing % 2 === 1) {
            this.playingEl.style.setProperty('color', '#ed9d64');
        } else {
            this.playingEl.style.setProperty('color', 'inherit');
        }
    }

    getPlayerGroups(players, positionOrder) {
        const groupedPlayers = [];
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

    static getPositionData() {
        return positionData;
    }

    static getPlayerData() {
        return playerData;
    }
}

export {PlayerList};