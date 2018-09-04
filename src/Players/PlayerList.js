import React, {Component, Fragment} from 'react';
import {PlayerGroup} from './PlayerGroup';

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
        };


    }

    componentDidMount() {
        this.setState({groups: this.getPlayerGroups(this.props.playerData, this.props.positionData)});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.playerData !== this.props.playerData) {
            console.log('setting groups');
            this.setState({groups: this.getPlayerGroups(this.props.playerData, this.props.positionData)});
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.playerData !== this.props.playerData) {
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
                                setIsPlaying={this.props.setIsPlaying}
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

export {PlayerList};