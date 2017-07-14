import 'whatwg-fetch';

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
              return response.json();
          })
          .then((json) => {
              const { result } = json;

              this.setState({
                  result,
                  searchTerm: url,
                  request: 'done'
              });
          })
          .catch(function(ex) {
              console.log('parsing failed', ex); // eslint-disable-line
          });
  }
  search(e) {
      const searchTerm = e.target.value;

      if(e.keyCode == 13) {
        this.get(searchTerm);
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?searchTerm=' + searchTerm;
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
              return response.json();
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
              console.log('parsing failed', ex); // eslint-disable-line
          });
  }
  render() {
    const { result, searchTerm, request } = this.state;
    let buttonValue = <button></button>;

    if(request == 'loading' && searchTerm) {
        buttonValue = <button style={{ margin: 0, height: "39px", padding: ".375rem 1% .375rem 1%" }} className="btn btn-block"><div className="spinner spinner-primary"></div></button>;
    } else if(request == 'done' && searchTerm) {
        buttonValue = <button style={{ margin: "0 5px", height: "39px", padding: ".375rem 1% .375rem 1%" }} onClick={this.save.bind(this)} className="btn btn-block"> Backup </button>;
    } else {
        buttonValue = <button style={{ margin: 0, height: "39px", padding: ".375rem 1% .375rem 1%" }} onClick={this.search.bind(this)} className="btn btn-block"> Search </button>;
    }

    return (
        <div style={{ width:"50%", margin: "0 auto" }}>
            <div style={{ padding: '20px', margin: '0 auto', width: '80%' }}>
                <div className="grid">
                    <div className="col-10-12">
                        <input style={{ height: "25px" }} onKeyDown={this.search.bind(this)} onKeyUp={this.search.bind(this)} type="text" placeholder={ searchTerm || "Enter the url you want view" }/>
                    </div>
                    <div className="col-2-12">
                        { buttonValue }
                    </div>
                </div>
                <br/>
                <div className="grid">
                    <div className="col-12-12">
                        { request === 'loading' ?
                            <ul className="list">
                                <div className="spinner-wrapper">
                                    <div className="spinner spinner-primary"></div>
                                </div>
                            </ul>
                        :
                        <div>
                            { Object.keys(result).length > 0 ?
                            <div>
                                <ul className="list">
                                    { result.dates.map((date, i) => { return (
                                    <li className="list-item" key={ i }>
                                        <a href={ `/v/${result.hash}/${date}/index.html` } target="_blank">
                                            { Moment(date, 'Y-M-D-h:mm:ss:a').format() } ({ Moment(date, 'Y-M-D-h:mm:ss:a').fromNow() })
                                        </a>
                                    </li>
                                    ); })}
                                </ul>
                            </div>
                            :
                            <div>
                                <ul className="list">
                                    <li className="list-item text-center">
                                        no results found 🙈
                                    </li>
                                </ul>
                            </div>
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Search;
