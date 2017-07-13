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
            })
            .then((json) => {
                this.setState({
                    results: json,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({
                    loading: false
                });
            });
    }
    render () {
        const { loading, results } = this.state;

        return (
            <div className="text-center" style={{ width:"50%", position: "absolute", top: "50%", transform: "translateY(-50%)", right: '25%'}}>
                { loading ?
                    <ul className="list" style={{ padding: '20px' }}>
                        <li className="list-item">
                            <div className="spinner-wrapper">
                                <div className="spinner spinner-primary"></div>
                            </div>
                        </li>
                    </ul>
                :
                    <div>
                        { results.length > 0 ?
                            <ul className="list" style={{ padding: '20px' }}>
                                { results.map((result, i) => {
                                    return (
                                        <li className="list-item" key={ i }>
                                            <a href={ `/backup/?searchTerm=${result.url}` } target="_blank">
                                                { result.url } - { result.dates.length } <small> { result.dates.length == 1 ? 'backup' : 'backups' }</small>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        :
                            <ul className="list" style={{ padding: '20px' }}>
                                <li className="list-item">
                                    no results found 🙈
                                </li>
                                <li className="list-item">
                                    <a href="/backup"> Back Something Up! </a>
                                </li>
                            </ul>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default Main;
