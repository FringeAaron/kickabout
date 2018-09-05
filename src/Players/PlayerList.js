import React, {Component, Fragment} from 'react';
import {Player} from "./Player";
import playerData from '../Data/players.json';
import positionData from '../Data/positions.json';
import './player.css';

function PlayingStatus(props) {
    return (
        <div className="player-status-bar">
            <span className="numbers playing">{props.playingPlayers}</span><span className="numbers"> / {props.totalPlayers}</span> <span>players this week</span>
        </div>
    )
}

class PlayerList extends Component {

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
        this.hydrateStateWithLocalStorage(this).then((result) => {
            this.el = document.querySelector('.player-status-bar');
            if (this.state.playerData.length === 0) {
                const playerData = PlayerList.getPlayerData();
                const positionData = PlayerList.getPositionData();
                this.setState({
                    playerData: playerData,
                    positionData: positionData,
                    groups: this.getPlayerGroups(playerData, positionData)
                }, () => {
                    console.log('saving state', this.state);
                    this.saveStateToLocalStorage();
                });
            }
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
            this.saveStateToLocalStorage();

            const el = document.querySelector('.player-status-bar');
            el.classList.add('highlight');
            setTimeout(() => {
                el.classList.remove('highlight');
            }, 200);
        })
    };

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

    hydrateStateWithLocalStorage(that) {
        return new Promise(function (resolve, reject) {
            console.log('hydrating');
            // for all items in state
            for (let key in that.state) {
                // if the key exists in localStorage
                if (localStorage.hasOwnProperty(key)) {
                    // get the key's value from localStorage
                    let value = localStorage.getItem(key);

                    // parse the localStorage string and setState
                    try {
                        value = JSON.parse(value);
                        that.setState({[key]: value});
                    } catch (e) {
                        // handle empty string
                        that.setState({[key]: value});
                    }
                }
            }
            resolve(true);
        });
    }


    saveStateToLocalStorage() {
        // for every item in React state
        for (let key in this.state) {
            // save to localStorage
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }
}

export {PlayerList};