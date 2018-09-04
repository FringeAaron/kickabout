import React, {Component} from 'react';
import logo from './ball.svg';
import './App.css';
import playerData from './Data/players.json';
import positionData from './Data/positions.json';
import {PlayerList} from './Players/PlayerList';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerData: [],
            positionData: [],
            page: null
        };

        this.setIsPlaying = this.setIsPlaying.bind(this);
    }

    componentDidMount() {
        this.hydrateStateWithLocalStorage();
        setTimeout(() => {
            if (this.state.playerData.length === 0) {
                this.setState({
                    playerData: App.getPlayerData(),
                    positionData: App.getPositionData()
                });
                console.log('saving state', this.state);
                setTimeout(() => {
                    this.saveStateToLocalStorage();
                });
            }
        });
    }

    setIsPlaying = (e) => {
        this.setState( ({playerData}) => {
            //console.log(e, playerData, positionData);
            const man = playerData.find(p => p.id === e.props.id);
            man.playing = !man.playing;
        }, () => {
            console.log(this.state);
            this.saveStateToLocalStorage();
        });


    };

    render() {
        return (
            <div className="App">
                <nav id="main">
                    <ul>
                        <li>
                            <a href="#" onClick={this.changePage}>
                                <img src={logo} className="App-logo" alt="logo"/>
                                <span className="logo-name">Kickabout</span>
                            </a>
                        </li>
                        <li>
                            <a href="players" onClick={this.changePage}>Players</a>
                        </li>
                    </ul>
                </nav>
                <div className="site-wrap">
                    <PlayerList {...this.state} setIsPlaying={this.setIsPlaying}/>
                </div>
            </div>
        );
    }

    createPage() {
        switch (this.state.page) {
            case "players":
                return <PlayerList {...this.state} />;
            default:
                return <h1>Welcome, welcome</h1>
        }
    }

    changePage = event => {
        event.preventDefault();
        const page = event.currentTarget.pathname.replace(/\W/g, '');
        this.setState({page: page});
    };

    static getPositionData() {
        return positionData;
    }

    static getPlayerData() {
        return playerData;
    }

    hydrateStateWithLocalStorage() {
        console.log('hydrating');
        // for all items in state
        for (let key in this.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    this.setState({[key]: value});
                } catch (e) {
                    // handle empty string
                    this.setState({[key]: value});
                }
            }
        }
    }

    saveStateToLocalStorage() {
        // for every item in React state
        for (let key in this.state) {
            // save to localStorage
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }
}

export default App;