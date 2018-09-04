import React, {Component, Fragment} from 'react';
import {Player} from './Player';

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
                        return (
                            <Player
                                key={player.id}
                                {...player}
                                setIsPlaying={this.props.setIsPlaying}
                            />
                        );
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

export {PlayerGroup};