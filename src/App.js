import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";

const twoDayAgo = new Date();
twoDayAgo.setDate(twoDayAgo.getDate() - 6);

let latestRegistrationDate = twoDayAgo.getTime() / 1000;

class App extends Component {
  constructor() {
    super();

    this.state = {
      freelancers: []
    };
  }

  componentDidMount() {
    this.fetchFreelancers(0, 100);
  }

  fetchFreelancers = async (offset, limit) => {
    const { match } = this.props;
    console.log(match);

    console.log(`Fetching ${limit} freelancers from ${offset}th`);
    try {
      //countries[]=United States&
      // let url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Argentina&countries[]=Mexico&countries[]=Peru&countries[]=Uruguay&countries[]=Spain&avatar=true&offset=${offset}&limit=${limit}`;
      // let url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=${match.params.country}&avatar=true&offset=${offset}&limit=${limit}&online_only=true`;
      // url += '&online_only=1';

      let url = "";
      if (match.params.country == "Europe") {
        url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Russian Federation&countries[]=Germany&countries[]=United Kingdom&countries[]=France&countries[]=Italy&countries[]=Spain&countries[]=Ukraine&countries[]=Poland&countries[]=Romania&countries[]=Netherlands&countries[]=Belgium&countries[]=Greece&countries[]=Portugal&countries[]=Sweden&countries[]=Hungary&countries[]=Belarus&countries[]=Austria&countries[]=Serbia&countries[]=Switzerland&countries[]=Bulgaria&countries[]=Denmark&countries[]=Finland&countries[]=Slovakia&countries[]=Norway&countries[]=Ireland&countries[]=Croatia&countries[]=Moldova&countries[]=Bosnia and Herzegovina&countries[]=Albania&countries[]=Lithuania&countries[]=Macedonia&countries[]=Slovenia&countries[]=Latvia&countries[]=Estonia&countries[]=Montenegro&countries[]=Luxembourg&countries[]=Malta&countries[]=Iceland&countries[]=Andorra&countries[]=Monaco&countries[]=Liechtenstein&avatar=true&offset=${offset}&limit=${limit}`;
        // url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Germany&countries[]=United Kingdom&countries[]=France&countries[]=Italy&countries[]=Netherlands&countries[]=Portugal&countries[]=Sweden&countries[]=Hungary&countries[]=Switzerland&countries[]=Denmark&countries[]=Finland&countries[]=Slovakia&countries[]=Norway&countries[]=Croatia&countries[]=Lithuania&countries[]=Macedonia&countries[]=Slovenia&countries[]=Latvia&countries[]=Estonia&countries[]=Georgia&countries[]=Luxembourg&countries[]=Spain&countries[]=Australia&countries[]=New Zealand&countries[]=Vietnam&countries[]=Bosnia and Herzegovina&countries[]=Singapore&countries[]=Thailand&countries[]=Ukraine&countries[]=Serbia&countries[]=Malaysia&countries[]=Moldova&avatar=true&offset=${offset}&limit=${limit}`;
        //Serbia, Ukraine, Bosnia and Herzegovina, Bulgaria, Spain, Russian Federation
        // url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Australia&countries[]=United Kingdom&countries[]=Germany&countries[]=Italy&countries[]=Estonia&avatar=true&offset=${offset}&limit=${limit}`;
      } else if (match.params.country == "America") {
        // url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Russian Federation&countries[]=Germany&countries[]=United Kingdom&countries[]=France&countries[]=Italy&countries[]=Spain&countries[]=Ukraine&countries[]=Poland&countries[]=Romania&countries[]=Netherlands&countries[]=Belgium&countries[]=Greece&countries[]=Portugal&countries[]=Sweden&countries[]=Hungary&countries[]=Belarus&countries[]=Austria&countries[]=Serbia&countries[]=Switzerland&countries[]=Bulgaria&countries[]=Denmark&countries[]=Finland&countries[]=Slovakia&countries[]=Norway&countries[]=Ireland&countries[]=Croatia&countries[]=Moldova&countries[]=Bosnia and Herzegovina&countries[]=Albania&countries[]=Lithuania&countries[]=Macedonia&countries[]=Slovenia&countries[]=Latvia&countries[]=Estonia&countries[]=Montenegro&countries[]=Luxembourg&countries[]=Malta&countries[]=Iceland&countries[]=Andorra&countries[]=Monaco&countries[]=Liechtenstein&avatar=true&offset=${offset}&limit=${limit}`;
        // url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Germany&countries[]=United States&countries[]=Canada&countries[]=Argentina&countries[]=Mexico&countries[]=Brazil&countries[]=Uruguay&countries[]=Chile&countries[]=Ecuador&countries[]=Peru&avatar=true&offset=${offset}&limit=${limit}`;
        url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=Argentina&countries[]=United States&countries[]=Uruguay&countries[]=Canada&avatar=true&offset=${offset}&limit=${limit}`;
        //Serbia, Ukraine, Bosnia and Herzegovina, Bulgaria, Spain, Russian Federation
      } else {
        url = `https://www.freelancer.com/api/users/0.1/users/directory?countries[]=${match.params.country}&avatar=true&offset=${offset}&limit=${limit}`;
      }
      if (match.params.online == "true") {
        url += "&online_only=1";
      }

      const res = await fetch(url);
      const { result } = await res.json();

      const { freelancers } = this.state;
      if (result.users.length > 0) {
        console.log(`Fetched ${result.users.length} freelancers`);
        const newFreelancers = [...freelancers];
        newFreelancers.push(
          ...result.users
            .filter(freelancer => {
              const exists =
                freelancers.filter(fl => fl.username === freelancer.username)
                  .length > 0;
              return (
                !exists && freelancer.registration_date > latestRegistrationDate
              );
            })
            .map(freelancer => {
              const newFreelancer = { ...freelancer };
              newFreelancer.profile_viewed = false;
              newFreelancer.profile_deleted = false;
              return newFreelancer;
            })
        );
        this.setState({ freelancers: newFreelancers });
        this.fetchFreelancers(offset + result.users.length, limit);
      } else {
        console.clear();
        console.log("Restart fetching freelancers ...");
        this.fetchFreelancers(0, limit);
      }
    } catch {
      setTimeout(() => {
        this.fetchFreelancers(offset, limit);
      }, 1000);
    }
  };

  viewFreelancerProfile = index => {
    const { freelancers } = this.state;
    const freelancer = freelancers[index];
    const { username } = freelancer;
    window.open(`https://www.freelancer.com/u/${username}`);
    freelancers[index].profile_viewed = true;
    this.setState({ freelancers });
  };

  removeFreelancer = index => {
    const { freelancers } = this.state;
    freelancers[index].profile_deleted = true;
    this.setState({ freelancers });
  };

  unviewFreelancerProfile = index => {
    const { freelancers } = this.state;
    freelancers[index].profile_viewed = !freelancers[index].profile_viewed;
    this.setState({ freelancers });
  };

  renderFreelancer = (freelancer, index) => {
    const {
      username,
      registration_date,
      profile_viewed,
      profile_deleted,
      location,
      avatar_cdn
    } = freelancer;
    const date = new Date(registration_date * 1000);
    if (profile_deleted) return null;
    return (
      <div key={index} className={`freelancer ${!profile_viewed ? "new" : ""}`}>
        <div className="info-panel">
          <div className="info-group">
            <div className="info-avatar">
              <img src={avatar_cdn} alt="Avatar" />
            </div>
            <div className="info-detail">
              <div className="info-detail--item">
                <label>Name: </label>
                <span>{username}</span>
              </div>
              <div className="info-detail--item">
                <label>Country: </label>
                <span>{location.country.name}</span>
              </div>
              <div className="info-detail--item">
                <label>Date: </label>
                <span>
                  {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
                </span>
              </div>
            </div>
          </div>
          {/* <a href = {`https://www.freelancer.com/u/${username}`} > View Profile </a> */}
          <button
            className="info-btn"
            onClick={() => this.viewFreelancerProfile(index)}
          >
            View Profile
          </button>
          <button
            className="info-btn"
            onClick={() => this.unviewFreelancerProfile(index)}
          >
            Unview
          </button>
          <button
            className="info-btn"
            onClick={() => this.removeFreelancer(index)}
          >
            Remove Freelancer
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { freelancers } = this.state;
    const sort = (a, b) => b.registration_date - a.registration_date;
    return (
      <div className="App">
        <h3>
          There are{" "}
          {freelancers.filter(freelancer => !freelancer.profile_deleted).length}{" "}
          new freelancers.
        </h3>
        {freelancers
          .sort(sort)
          .map((freelancer, index) => this.renderFreelancer(freelancer, index))}
      </div>
    );
  }
}

export default withRouter(App);
