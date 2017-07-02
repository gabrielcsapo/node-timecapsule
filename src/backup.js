import 'whatwg-fetch'

import React from 'react';
import Moment from 'moment';
import Url from 'url';
import QS from 'querystring';

class Search extends React.Component {
  constructor(props) {
      super(props);
      const url = Url.parse(location.href);
      const query = QS.parse(url.query);

      this.state = {
          result: {},
          searchTerm: query.searchTerm || '',
          request: 'done' // loading, done, error
      };
      this.get(this.state.searchTerm);
  }
  get(url) {
      this.setState({
          request: 'loading'
      });

      fetch(`/api/i/${url}`)
      .then((response) => {
          return response.json()
      }).then((json) => {
          this.setState({
              result: json,
              searchTerm: url,
              request: 'done'
          });
      }).catch(function(ex) {
          console.log('parsing failed', ex)
      })
  }
  search(e) {
      const searchTerm = e.target.value;

      if(e.keyCode == 13) {
        this.get(searchTerm);
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?searchTerm=' + searchTerm;;
            window.history.pushState({path:newurl},'',newurl);
        }
      }
  }
  save() {
      const { searchTerm } = this.state;
      this.setState({
          request: 'loading'
      });
      fetch(`/api/b/${searchTerm}`)
          .then((response) => {
              return response.json()
          })
          .then((json) => {
              if(json.error) {
                  this.setState({
                      request: 'error'
                  });
              } else {
                  this.setState({
                      request: 'done'
                  });
                  this.get(searchTerm);
              }
          }).catch(function(ex) {
              console.log('parsing failed', ex)
          })
  }
  render() {
    const { result, searchTerm, request } = this.state;
    const buttonValue = request === 'loading' ? (<div className="spinner spinner-primary"></div>) : request == 'error' ? 'something went wrong :( ' : <span> Backup </span>;

    return (
        <div style={{ width:"100%" }}>
            <div style={{ padding: '20px', margin: '0 auto', width: '80%' }}>
                <input onKeyDown={this.search.bind(this)} onKeyUp={this.search.bind(this)} type="text" placeholder={ searchTerm || "Enter the url you want view" } />
                <div style={{ padding: '20px' }}>
                { request === 'loading' ?
                    <div className="panel panel-default" style={{ width: '100%', height: '200px' }}>
                        <div className="spinner-wrapper">
                            <div className="spinner spinner-primary"></div>
                        </div>
                    </div>
                :
                    <div>
                        <div className="text-center">
                            <b>{ searchTerm }</b>
                        </div>
                        <div>
                            <small> Options </small>
                            <br/>
                            <button onClick={this.save.bind(this)} className="btn"> { buttonValue } </button>
                        </div>
                        <div>
                            <small> Results </small>
                            <br/>
                            { Object.keys(result).length > 0 ?
                                <div>
                                    <ul className="list" style={{ padding: '20px' }}>
                                        { result.dates.map((date, i) => {
                                            return (
                                                <li className="list-item" key={ i }>
                                                    <a href={ `/v/${result.hash}/${date}/index.html` } target="_blank">
                                                        { Moment(date, 'Y-M-D-h:mm:ss:a').format() } ({ Moment(date, 'Y-M-D-h:mm:ss:a').fromNow() })
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
                    </div>
                }
                </div>
            </div>
        </div>
    );
  }
}

export default Search;
