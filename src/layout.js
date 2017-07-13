import React from 'react';
import PropTypes from 'prop-types';

class Layout extends React.Component {
  render () {
    const { children } = this.props;

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div className="navbar navbar-center">
          <div className="container">
            <div className="navbar-title">
              <a className="text-black" href="/">
                <span style={{ fontSize: '30px' }} className="text-black">node-timecapsule</span>
              </a>
            </div>
            <div className="nav">
                <a href="/">Main</a>
                <a href="/backup">Backup</a>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "60px" }}>
          { children }
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object
};

export default Layout;
