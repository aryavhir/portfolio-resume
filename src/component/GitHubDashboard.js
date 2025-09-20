import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import CardSwap, { Card } from "../asset/swap-card/CardSwap";

export const GitHubDashboard = () => {
  const [githubData, setGithubData] = useState({
    user: null,
    repos: [],
    commits: [],
    loading: true,
    error: null,
  });

  const USERNAME = "aryavhir"; // Replace with your GitHub username
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN; // Optional: for higher rate limits

  useEffect(() => {
    fetchGithubData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGithubData = async () => {
    try {
      const headers = GITHUB_TOKEN
        ? { Authorization: `token ${GITHUB_TOKEN}` }
        : {};

      // Fetch user data
      const userResponse = await fetch(
        `https://api.github.com/users/${USERNAME}`,
        { headers }
      );
      const userData = await userResponse.json();

      // Fetch repos
      const reposResponse = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`,
        { headers }
      );
      const reposData = await reposResponse.json();

      // Fetch commits
      const commitsPromises = reposData.slice(0, 3).map((repo) =>
        fetch(
          `https://api.github.com/repos/${USERNAME}/${repo.name}/commits?per_page=3`,
          { headers }
        )
          .then((res) => res.json())
          .then((commits) =>
            commits.map((commit) => ({ ...commit, repo: repo.name }))
          )
      );

      const commitsArrays = await Promise.all(commitsPromises);
      const allCommits = commitsArrays.flat().slice(0, 5);

      setGithubData({
        user: userData,
        repos: reposData.slice(0, 6),
        commits: allCommits,
        loading: false,
        error: null,
      });
    } catch (error) {
      setGithubData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch GitHub data",
      }));
    }
  };


  return (
    <section className="github-dashboard" id="github">
      <div style={{ height: "540px", position: "relative" }}>
        <CardSwap cardDistance={60} verticalDistance={70} delay={2000} pauseOnHover={true}>
          
          {/* Card 1 - Gaming Hobby: Valorant */}
          <Card>
            <div style={{ padding: "15px", backgroundColor: "#000000" }}>
              <h4 style={{ color: "#fff" }}>Gaming</h4>
              <div style={{ borderRadius: 12, overflow: "hidden", background: "#0b0b0b", marginTop: 8 }}>
                <iframe
                  style={{ width: "100%", height: 315, border: 0 }}
                  src="https://www.youtube.com/embed/cLx3tyzht3Y"
                  title="Valorant Gameplay"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <small style={{ display: "block", marginTop: 8, opacity: 0.7 }}>I main Duelists · Always down for scrims.</small>
            </div>
          </Card>

          {/* Card 2 - Vibing To (Spotify Embed) */}
          <Card>
            <div style={{ padding: "15px", backgroundColor: "#000000" }}> 
              <h4 style={{ color: "#fff" }}>Vibing To</h4>
              <div style={{ borderRadius: 12, overflow: "hidden", background: "#0b0b0b" }}>
                <iframe
                  style={{ borderRadius: 12, width: "100%", height: 352, border: 0 }}
                  src={`https://open.spotify.com/embed/album/6OGzmhzHcjf0uN9j7dYvZH?utm_source=generator&theme=0`}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Player"
                />
              </div>
              <small style={{ display: "block", marginTop: 8, opacity: 0.7 }}>
                Updated: Sep 2025 · Track: current favorite
              </small>
            </div>
          </Card>

          {/* Card 3 - Next Up: Penetration Testing (Video) */}
          <Card>
            <div style={{ padding: "15px", backgroundColor: "#000000" }}>
              <h4 style={{ color: "#fff" }}>Next Up</h4>
              <div style={{ borderRadius: 12, overflow: "hidden", background: "#0b0b0b", marginTop: 8 }}>
                <iframe
                  style={{ width: "100%", height: 315, border: 0 }}
                  src="https://www.youtube.com/embed/3Kq1MIfTWCE"
                  title="Penetration Testing Roadmap"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <small style={{ display: "block", marginTop: 8, opacity: 0.7 }}>Kicking off with fundamentals and lab setups.</small>
            </div>
          </Card>

        </CardSwap>
      </div>
    </section>
  );
};
