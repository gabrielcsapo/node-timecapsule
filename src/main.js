import 'whatwg-fetch'

import React from 'react';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            loading: false
        }
    }
    componentWillMount() {
        this.setState({
            loading: true
        });

        fetch(`/api/a`)
        .then((response) => {
            return response.json()
        }).then((json) => {
            console.log(json);
            this.setState({
                results: json,
                loading: false
            });
        })
    }
    render () {
        const { loading, results } = this.state;

        return (
            <div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
                <h3 className="text-black">🌤</h3>
                { loading ?
                    <div className="panel panel-default" style={{ width: '100%', height: '200px' }}>
                        <div className="spinner-wrapper">
                            <div className="spinner spinner-primary"></div>
                        </div>
                    </div>
                :
                    <div>
                        { results.length > 0 ?
                            <div style={{ width: "50%", margin: "0 auto" }}>
                                <ul className="list" style={{ padding: '20px' }}>
                                    { results.map((result, i) => {
                                        return (
                                            <li className="list-item" key={ i }>
                                                <a href={ `${result.recent}` } target="_blank">
                                                    { result.url } - { result.dates.length } <small> { result.dates.length == 1 ? 'backup' : 'backups' }</small>
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        :
                            <div className="panel panel-default" style={{ width: '100%', height: '200px', lineHeight: '200px', textAlign: 'center' }}>
                                no results found 🙈
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default Main;
