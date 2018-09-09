import React, {Component} from 'react';
import {connect} from 'react-redux';
import {simpleAction} from "./Actions/simpleAction";
import './App.css';
import {PlayerList} from './Players/PlayerList';

class App extends Component {
    render() {
        return (
            <div className="App">
                {/*<nav id="main">
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
                </nav>*/}
                <div className="site-wrap">
                    <PlayerList action={this.props.simpleAction}/>
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



}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    simpleAction: () => dispatch(simpleAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);