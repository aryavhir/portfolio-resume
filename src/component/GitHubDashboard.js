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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3776ab",
      Java: "#b07219",
      React: "#61dafb",
      HTML: "#e34c26",
      CSS: "#1572b6",
      C: "#555555",
      "C++": "#f34b7d",
      Go: "#00add8",
      Rust: "#dea584",
      PHP: "#4f5d95",
    };
    return colors[language] || "#586069";
  };

  if (githubData.loading) {
    return (
      <section className="github-dashboard" id="github">
        <Container>
          <Row>
            <Col>
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading GitHub data...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (githubData.error) {
    return (
      <section className="github-dashboard" id="github">
        <Container>
          <Row>
            <Col>
              <div className="text-center py-5">
                <p className="text-danger">{githubData.error}</p>
                <button className="btn btn-primary" onClick={fetchGithubData}>
                  Retry
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="github-dashboard" id="github">
      <div style={{ height: "600px", position: "relative" }}>
        <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
          
          {/* Card 1 - Top Repositories */}
          <Card>
            <div style={{ padding: "15px" }}>
              <h4>Top Repositories</h4>
              {githubData.repos.slice(0, 4).map((repo, index) => (
                <div
                  key={index}
                  className="repo-item mb-3"
                  onClick={() => window.open(repo.html_url, "_blank")}
                  style={{ cursor: "pointer", borderBottom: "1px solid #333", paddingBottom: "10px" }}
                >
                  <div className="repo-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{repo.name}</h5>
                    <div>
                      <Badge bg="secondary">⭐ {repo.stargazers_count}</Badge>{" "}
                      <Badge bg="dark">🍴 {repo.forks_count}</Badge>
                    </div>
                  </div>
                  <p className="mb-1">{repo.description}</p>
                  <small>
                    {repo.language && (
                      <span style={{ color: getLanguageColor(repo.language) }}>
                        ● {repo.language}
                      </span>
                    )}{" "}
                    | Updated {formatDate(repo.updated_at)}
                  </small>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 2 - Contribution Graph */}
          <Card>
            <div style={{ padding: "15px", textAlign: "center" }}>
              <h4>Contribution Graph</h4>
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=dark&hide_border=true&bg_color=0D1117&title_color=F85D7F&icon_color=F85D7F&text_color=FFFFFF`}
                alt="GitHub Stats"
                style={{ width: "100%", marginBottom: "15px", borderRadius: "8px" }}
              />
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=dark&hide_border=true&background=0D1117&stroke=F85D7F&ring=F85D7F&fire=F85D7F&currStreakLabel=FFFFFF`}
                alt="GitHub Streak"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          </Card>

          {/* Card 3 - Recent Commits */}
          <Card>
            <div style={{ padding: "15px" }}>
              <h4>Recent Commits</h4>
              {githubData.commits.map((commit, index) => (
                <div key={index} className="mb-3">
                  <strong>{commit.repo}</strong>
                  <p style={{ margin: "5px 0" }}>{commit.commit.message}</p>
                  <small>{formatDate(commit.commit.author.date)}</small>
                </div>
              ))}
            </div>
          </Card>

        </CardSwap>
      </div>
    </section>
  );
};
